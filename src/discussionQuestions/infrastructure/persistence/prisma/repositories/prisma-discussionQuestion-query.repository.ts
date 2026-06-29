import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { DiscussionQuestion } from 'src/generated/prisma/client';

import { FindDiscussionQuestionsCursorQuery } from 'src/discussionQuestions/application/interfaces/find-discussionQuestions.query';
import { DiscussionQuestionQueryRepository } from 'src/discussionQuestions/application/ports/discussionQuestion-query.repository';

@Injectable()
export class PrismaDiscussionQuestionQueryRepository implements DiscussionQuestionQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    options: FindDiscussionQuestionsCursorQuery,
  ): Promise<CursorPageDto<DiscussionQuestion>> {
    const { cursor, take } = options;

    const items = await this.prisma.discussionQuestion.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<DiscussionQuestion | null> {
    return this.prisma.discussionQuestion.findUnique({
      where: { id },
    });
  }
}
