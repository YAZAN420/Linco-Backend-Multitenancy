import { Injectable } from '@nestjs/common';
import type { DiscussionQuestion as PrismaDiscussionQuestion } from 'src/generated/prisma/client';
import { DiscussionQuestion } from 'src/discussionQuestions/domain/discussionQuestion';
@Injectable()
export class PrismaDiscussionQuestionMapper {
  toDomain(raw: PrismaDiscussionQuestion): DiscussionQuestion {
    return new DiscussionQuestion(raw.id, {
      content: raw.content,
      lessonId: raw.lessonId,
      demoMemberId: raw.demoMemberId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(
    discussionQuestion: DiscussionQuestion,
  ): PrismaDiscussionQuestion {
    return {
      id: discussionQuestion.id,
      content: discussionQuestion.content,
      lessonId: discussionQuestion.lessonId,
      demoMemberId: discussionQuestion.demoMemberId,
      createdAt: discussionQuestion.createdAt,
      updatedAt: discussionQuestion.updatedAt,
    };
  }
}
