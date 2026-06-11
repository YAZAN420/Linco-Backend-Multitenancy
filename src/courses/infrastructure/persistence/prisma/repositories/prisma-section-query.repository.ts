import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, Section } from 'src/generated/prisma/client';
import { SectionQueryRepository } from 'src/courses/application/ports/section-query.repository';
import { FindSectionsCursorQuery } from 'src/courses/application/interfaces/find-sections.query';

const SECTION_SEARCH_COLUMNS = [];
const SECTION_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaSectionQueryRepository implements SectionQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<T extends FindSectionsCursorQuery>(options: T) {
    return {
      where: buildWhere<T, Prisma.SectionWhereInput>(
        options,
        SECTION_SEARCH_COLUMNS,
      ),
      orderBy: buildOrderBy(options.orderBy, SECTION_ORDERABLE_FIELDS),
    };
  }

  async findAllCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.section.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        ...where,
        courseId: courseId,
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

  async findById(courseId: string, sectionId: string): Promise<Section | null> {
    return this.prisma.section.findFirst({
      where: { id: sectionId, courseId: courseId },
    });
  }
}
