import { Injectable } from '@nestjs/common';
import type { DiscussionAnswer as PrismaDiscussionAnswer } from 'src/generated/prisma/client';
import { DiscussionAnswer } from 'src/discussionQuestions/domain/discussionAnswer';

@Injectable()
export class PrismaDiscussionAnswerMapper {
  toDomain(raw: PrismaDiscussionAnswer): DiscussionAnswer {
    return new DiscussionAnswer(raw.id, {
      content: raw.content,
      discussionId: raw.discussionId,
      demoMemberId: raw.demoMemberId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(discussionAnswer: DiscussionAnswer): PrismaDiscussionAnswer {
    return {
      id: discussionAnswer.id,
      content: discussionAnswer.content,
      discussionId: discussionAnswer.discussionId,
      demoMemberId: discussionAnswer.demoMemberId,
      createdAt: discussionAnswer.createdAt,
      updatedAt: discussionAnswer.updatedAt,
    };
  }
}
