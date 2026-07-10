import { Injectable } from '@nestjs/common';
import { DiscussionQuestionResponseDto } from '../dto/discussionQuestion-response.dto';
import { DiscussionQuestionWithDemoMember } from 'src/core/database/prisma/types';
import { DemoMemberResponseMapper } from 'src/demos/presentation/http/mappers/demo-member-response.mapper';

@Injectable()
export class DiscussionQuestionResponseMapper {
  constructor(
    private readonly demoMemberResponseMapper: DemoMemberResponseMapper,
  ) {}
  toResponseFromPrisma(
    discussionQuestion: DiscussionQuestionWithDemoMember,
  ): DiscussionQuestionResponseDto {
    return new DiscussionQuestionResponseDto(
      discussionQuestion.id,
      discussionQuestion.content,
      discussionQuestion.lessonId,
      discussionQuestion.createdAt,
      discussionQuestion.updatedAt,
      this.demoMemberResponseMapper.toResponseFromPrisma(
        discussionQuestion.demoMember,
      ),
    );
  }

  toResponseManyFromPrisma(
    discussionQuestions: DiscussionQuestionWithDemoMember[],
  ): DiscussionQuestionResponseDto[] {
    return discussionQuestions.map((discussionQuestion) =>
      this.toResponseFromPrisma(discussionQuestion),
    );
  }
}
