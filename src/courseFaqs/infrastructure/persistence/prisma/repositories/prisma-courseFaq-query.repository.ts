import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { CourseFaq } from 'src/generated/prisma/client';

import { FindCourseFaqsCursorQuery } from 'src/courseFaqs/application/interfaces/find-courseFaqs.query';
import { CourseFaqQueryRepository } from 'src/courseFaqs/application/ports/courseFaq-query.repository';

@Injectable()
export class PrismaCourseFaqQueryRepository implements CourseFaqQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    courseId: string,
    options: FindCourseFaqsCursorQuery,
  ): Promise<CursorPageDto<CourseFaq>> {
    const { cursor, take } = options;

    const items = await this.prisma.courseFaq.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      where: {
        courseId,
      },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<CourseFaq | null> {
    return this.prisma.courseFaq.findUnique({
      where: { id },
    });
  }
}
