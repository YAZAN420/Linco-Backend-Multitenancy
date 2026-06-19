import { Injectable } from '@nestjs/common';
import { DiscussionQuestionResponseDto } from '../dto/discussionQuestion-response.dto';
import { DiscussionQuestion as PrismaDiscussionQuestion } from 'src/generated/prisma/client';
import { DiscussionQuestion as DomainDiscussionQuestion } from 'src/discussionQuestions/domain/discussionQuestion';

@Injectable()
export class DiscussionQuestionResponseMapper {
  toResponseFromPrisma(
    discussionQuestion: PrismaDiscussionQuestion,
  ): DiscussionQuestionResponseDto {
    return new DiscussionQuestionResponseDto(
      discussionQuestion.id,
      discussionQuestion.content,
      discussionQuestion.lessonId,
      discussionQuestion.demoMemberId,
      discussionQuestion.createdAt,
      discussionQuestion.updatedAt,
    );
  }

  toResponseFromDomain(
    discussionQuestion: DomainDiscussionQuestion,
  ): DiscussionQuestionResponseDto {
    return new DiscussionQuestionResponseDto(
      discussionQuestion.id,
      discussionQuestion.content,
      discussionQuestion.lessonId,
      discussionQuestion.demoMemberId,
      discussionQuestion.createdAt,
      discussionQuestion.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    discussionQuestions: PrismaDiscussionQuestion[],
  ): DiscussionQuestionResponseDto[] {
    return discussionQuestions.map((discussionQuestion) =>
      this.toResponseFromPrisma(discussionQuestion),
    );
  }
}
