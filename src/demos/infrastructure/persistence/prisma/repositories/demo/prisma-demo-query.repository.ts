import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import {
  FindDemosCursorQuery,
  FindDemosQuery,
  FindDepartmentCursorQuery,
} from 'src/demos/application/demo/interfaces/find-demos.query';
import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';
import {
  AdminDemoStats,
  DemoWithOwnership,
  DepartmentLeaderboardItem,
  DepartmentWithDetails,
} from 'src/core/database/prisma/types';
import { Prisma } from 'src/generated/prisma/client';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';

@Injectable()
export class PrismaDemoQueryRepository implements DemoQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: FindDemosQuery): Promise<PageDto<DemoWithOwnership>> {
    const skip = (options.page - 1) * options.take;
    const where: Prisma.DemoWhereInput = {};

    if (options.search) {
      where.name = {
        contains: options.search,
        mode: 'insensitive',
      };
    }

    if (options.status) {
      where.subscriptionStatus = options.status;
    }

    const [items, itemCount] = await Promise.all([
      this.prisma.demo.findMany({
        where,
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
        include: {
          _count: {
            select: { members: true, departments: true },
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

  async getAdminStats(): Promise<AdminDemoStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalCompanies,
      activeCompanies,
      newCompaniesThisMonth,
      totalMembers,
    ] = await Promise.all([
      this.prisma.demo.count(),

      this.prisma.demo.count({
        where: { subscriptionStatus: SubscriptionStatus.ACTIVE },
      }),

      this.prisma.demo.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      this.prisma.demoMember.count(),
    ]);

    return {
      totalCompanies,
      activeCompanies,
      newCompaniesThisMonth,
      totalMembers,
    };
  }

  async findAllForMe(
    options: FindDemosCursorQuery,
    userId: string,
  ): Promise<CursorPageDto<DemoWithOwnership>> {
    const { cursor, take } = options;

    const items = await this.prisma.demo.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId: userId } } }],
      },
      orderBy: [{ id: 'desc' }],
      include: {
        _count: {
          select: { members: true, departments: true },
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
          select: { members: true, departments: true },
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
    demoMemberId?: string,
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
            demoMemberId,
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

  async getDepartmentLeaderboard(
    deptId: string,
    options: CursorPageOptionsDto,
  ): Promise<CursorPageDto<DepartmentLeaderboardItem>> {
    const { cursor, take } = options;

    const items = await this.prisma.departmentLeaderboard.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        departmentId: deptId,
      },
      orderBy: [{ totalScore: 'desc' }, { id: 'asc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }
}
