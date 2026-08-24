import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import { FindSectionsCursorQuery } from 'src/courses/application/interfaces/find-sections.query';
import { Section } from 'src/generated/prisma/client';
import { SectionWithExamAndQuestionCount } from 'src/core/database/prisma/types';
import { SectionQueryRepository } from 'src/courses/application/ports/section-query.repository';

@Injectable()
export class PrismaSectionQueryRepository implements SectionQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findSectionsCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    const { cursor, take } = options;

    const items = await this.prisma.section.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      where: { courseId },
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findSectionById(sectionId: string): Promise<Section | null> {
    return this.prisma.section.findUnique({
      where: { id: sectionId },
    });
  }

  async findSectionWithExamAndQuestionCount(
    sectionId: string,
  ): Promise<SectionWithExamAndQuestionCount | null> {
    return this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        exam: true,
        _count: { select: { questionsBank: true } },
      },
    });
  }
}
