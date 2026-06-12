import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, Lesson } from 'src/generated/prisma/browser';

import { FindLessonsCursorQuery } from 'src/lessons/application/interfaces/find-lessons.query';
import { LessonQueryRepository } from 'src/lessons/application/ports/lesson-query.repository';

const LESSON_SEARCH_COLUMNS = [];
const LESSON_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaLessonQueryRepository implements LessonQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<T extends FindLessonsCursorQuery>(options: T) {
    return {
      where: buildWhere<T, Prisma.LessonWhereInput>(
        options,
        LESSON_SEARCH_COLUMNS,
      ),
      orderBy: buildOrderBy(options.orderBy, LESSON_ORDERABLE_FIELDS),
    };
  }

  async findAllCursor(
    options: FindLessonsCursorQuery,
  ): Promise<CursorPageDto<Lesson>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.lesson.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
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

  async findById(id: string): Promise<Lesson | null> {
    return this.prisma.lesson.findUnique({
      where: { id },
    });
  }
}
