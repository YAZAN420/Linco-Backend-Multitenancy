import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import { FindDiscussionQuestionsCursorQuery } from 'src/discussionQuestions/application/interfaces/find-discussionQuestions.query';
import { DiscussionQuestionQueryRepository } from 'src/discussionQuestions/application/ports/discussionQuestion-query.repository';
import { DiscussionQuestionWithDemoMember } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaDiscussionQuestionQueryRepository implements DiscussionQuestionQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    lessonId: string,
    options: FindDiscussionQuestionsCursorQuery,
  ): Promise<CursorPageDto<DiscussionQuestionWithDemoMember>> {
    const { cursor, take } = options;
    const items = await this.prisma.discussionQuestion.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      where: { lessonId },
      include: {
        demoMember: {
          include: {
            user: true,
          },
        },
        answers: {
          take: 3,
          orderBy: { createdAt: 'asc' },
          include: {
            demoMember: {
              include: {
                user: true,
              },
            },
          },
        },
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

  async findById(id: string): Promise<DiscussionQuestionWithDemoMember | null> {
    return this.prisma.discussionQuestion.findUnique({
      where: { id },
      include: {
        demoMember: {
          include: {
            user: true,
          },
        },
        answers: {
          take: 3,
          orderBy: { createdAt: 'asc' },
          include: {
            demoMember: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }
}
