import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import {
  FindDemosCursorQuery,
  FindDemosQuery,
  FindDepartmentCursorQuery,
} from 'src/demos/application/demo/interfaces/find-demos.query';
import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';
import {
  DemoWithOwnership,
  DepartmentWithDetails,
} from 'src/core/database/prisma/types';

const DEMO_SEARCH_COLUMNS = [];
const DEMO_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaDemoQueryRepository implements DemoQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<T extends FindDemosQuery | FindDemosCursorQuery>(
    options: T,
  ) {
    return {
      where: buildWhere<T, Prisma.DemoWhereInput>(options, DEMO_SEARCH_COLUMNS),
      orderBy: buildOrderBy(options.orderBy, DEMO_ORDERABLE_FIELDS),
    };
  }

  async findAll(options: FindDemosQuery): Promise<PageDto<DemoWithOwnership>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.demo.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
        include: {
          _count: {
            select: { members: true },
          },
          owner: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.demo.count({ where }),
    ]);
    const itemsWithOwnership = items.map((item) => ({
      ...item,
      isOwner: false,
    }));

    return new PageDto(
      itemsWithOwnership,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllForMe(
    options: FindDemosCursorQuery,
    userId: string,
  ): Promise<CursorPageDto<DemoWithOwnership>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.demo.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        ...where,
        OR: [{ ownerId: userId }, { members: { some: { userId: userId } } }],
      },
      orderBy: orderBy.length > 0 ? orderBy : [{ id: 'desc' }],
      include: {
        _count: {
          select: { members: true },
        },
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    const itemsWithOwnership = items.map((item) => ({
      ...item,
      isOwner: item.ownerId === userId,
    }));

    return new CursorPageDto(
      itemsWithOwnership,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(
    id: string,
    userId?: string,
  ): Promise<DemoWithOwnership | null> {
    const demo = await this.prisma.demo.findUnique({
      where: { id },
      include: {
        _count: {
          select: { members: true },
        },
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!demo) return null;

    return {
      ...demo,
      isOwner: demo.ownerId === userId,
    };
  }

  async demoExists(id: string): Promise<boolean> {
    const count = await this.prisma.demo.count({
      where: { id },
    });
    return count > 0;
  }

  async findDepartments(
    options: FindDepartmentCursorQuery,
    demoId: string,
    userId: string,
  ): Promise<CursorPageDto<DepartmentWithDetails>> {
    const { cursor, take } = options;

    const items = await this.prisma.department.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        demoId,
      },
      orderBy: [{ createdAt: 'desc' }],
      include: {
        _count: {
          select: { members: true, courses: true },
        },
        members: {
          where: {
            demoMember: {
              userId: userId,
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    const formattedItems = items.map((item) => {
      const { members, ...rest } = item;
      return {
        ...rest,
        isJoined: members.length > 0,
      };
    });

    return new CursorPageDto(
      formattedItems,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findDepartmentById(
    deptId: string,
    userId: string,
  ): Promise<DepartmentWithDetails | null> {
    const dept = await this.prisma.department.findUnique({
      where: {
        id: deptId,
      },
      include: {
        _count: {
          select: { members: true, courses: true },
        },
        members: {
          where: {
            demoMember: {
              userId: userId,
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!dept) return null;

    const { members, ...rest } = dept;
    return {
      ...rest,
      isJoined: members.length > 0,
    };
  }
}
