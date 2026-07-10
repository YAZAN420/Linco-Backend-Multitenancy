import { Injectable } from '@nestjs/common';
import { DiscussionAnswerResponseDto } from '../dto/discussionAnswer-response.dto';
import { DiscussionAnswerWithDemoMember } from 'src/core/database/prisma/types';
import { DemoMemberResponseMapper } from 'src/demos/presentation/http/mappers/demo-member-response.mapper';

@Injectable()
export class DiscussionAnswerResponseMapper {
  constructor(
    private readonly demoMemberResponseMapper: DemoMemberResponseMapper,
  ) {}

  toResponseFromPrisma(
    discussionAnswer: DiscussionAnswerWithDemoMember,
  ): DiscussionAnswerResponseDto {
    return new DiscussionAnswerResponseDto(
      discussionAnswer.id,
      discussionAnswer.content,
      discussionAnswer.discussionId,
      discussionAnswer.createdAt,
      discussionAnswer.updatedAt,
      this.demoMemberResponseMapper.toResponseFromPrisma(
        discussionAnswer.demoMember,
      ),
    );
  }

  toResponseManyFromPrisma(
    discussionAnswers: DiscussionAnswerWithDemoMember[],
  ): DiscussionAnswerResponseDto[] {
    return discussionAnswers.map((answer) => this.toResponseFromPrisma(answer));
  }
}
