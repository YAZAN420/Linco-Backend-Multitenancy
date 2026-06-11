import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import {
  buildNestedInclude,
  buildOrderBy,
  buildWhere,
} from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, Section } from 'src/generated/prisma/browser';
import { SectionQueryRepository } from 'src/courses/application/ports/section-query.repository';
import { FindSectionsCursorQuery, FindSectionsQuery } from 'src/courses/application/interfaces/find-sections.query';
import { SectionInclude } from 'src/generated/prisma/internal/prismaNamespaceBrowser';

const SECTION_SEARCH_COLUMNS = [];
const SECTION_ORDERABLE_FIELDS = ['createdAt'];
type SectionRelation = keyof Prisma.SectionInclude;

@Injectable()
export class PrismaSectionQueryRepository implements SectionQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly allowedRelations: SectionRelation[] = [];
  private buildPrismaArgs<T extends FindSectionsQuery | FindSectionsCursorQuery>(
    options: T,
  ) {
    return {
      where: buildWhere<T, Prisma.SectionWhereInput>(
        options,
        SECTION_SEARCH_COLUMNS,
      ),
      orderBy: buildOrderBy(options.orderBy, SECTION_ORDERABLE_FIELDS),
      include: buildNestedInclude<SectionInclude>(
        options.with,
        this.allowedRelations,
      ),
    };
  }

  async findAll(options: FindSectionsQuery): Promise<PageDto<Section>> {
    const { where, orderBy, include } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.section.findMany({
        skip,
        take: options.take,
        where,
        include,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.section.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    const { where, orderBy, include } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.section.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      include,
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

  async findById(id: string): Promise<Section | null> {
    const include = buildNestedInclude<SectionInclude>(this.allowedRelations);

    return this.prisma.section.findUnique({
      where: { id },
      include,
    });
  }
}
