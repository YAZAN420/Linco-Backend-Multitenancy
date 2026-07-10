import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { FindDiscussionAnswersCursorQuery } from 'src/discussionQuestions/application/interfaces/find-discussionAnswers.query';
import { DiscussionAnswerQueryRepository } from 'src/discussionQuestions/application/ports/discussionAnswer-query.repository';
import { DiscussionAnswerWithDemoMember } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaDiscussionAnswerQueryRepository implements DiscussionAnswerQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    discussionId: string,
    options: FindDiscussionAnswersCursorQuery,
  ): Promise<CursorPageDto<DiscussionAnswerWithDemoMember>> {
    const { cursor, take } = options;

    const items = await this.prisma.discussionAnswer.findMany({
      where: { discussionId },
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ createdAt: 'asc' }],
      include: {
        demoMember: { include: { user: true } },
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

  async findById(id: string): Promise<DiscussionAnswerWithDemoMember | null> {
    return this.prisma.discussionAnswer.findUnique({
      where: { id },
      include: { demoMember: { include: { user: true } } },
    });
  }
}
