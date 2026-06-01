import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, Demo } from 'src/generated/prisma/client';
import {
  FindDemosCursorQuery,
  FindDemosQuery,
} from 'src/demos/application/interfaces/find-demos.query';
import { DemoQueryRepository } from 'src/demos/application/ports/demo-query.repository';

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

  async findAll(options: FindDemosQuery): Promise<PageDto<Demo>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.demo.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.demo.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllForMe(
    options: FindDemosCursorQuery,
    ownerId: string,
  ): Promise<CursorPageDto<Demo>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.demo.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        ...where,
        deletedAt: null,
        ownerId,
      },
      orderBy: orderBy.length > 0 ? orderBy : [{ id: 'desc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<Demo | null> {
    return this.prisma.demo.findFirst({
      where: { id, deletedAt: null },
    });
  }
}
