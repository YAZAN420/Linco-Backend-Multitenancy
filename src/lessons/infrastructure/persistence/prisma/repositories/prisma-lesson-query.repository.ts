import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Lesson } from 'src/generated/prisma/browser';

import { FindLessonsCursorQuery } from 'src/lessons/application/interfaces/find-lessons.query';
import { LessonQueryRepository } from 'src/lessons/application/ports/lesson-query.repository';

@Injectable()
export class PrismaLessonQueryRepository implements LessonQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    sectionId: string,
    options: FindLessonsCursorQuery,
  ): Promise<CursorPageDto<Lesson>> {
    const { cursor, take } = options;

    const items = await this.prisma.lesson.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        sectionId: sectionId,
      },
      orderBy: [{ order: 'desc' }],
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
