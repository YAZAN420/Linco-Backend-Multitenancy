import { DemoMemberResponseDto } from 'src/demos/presentation/http/dto/demo-member/demo-member-response.dto';
import { DiscussionAnswerResponseDto } from './discussionAnswer-response.dto';

export class DiscussionQuestionResponseDto {
  constructor(
    readonly id: string,
    readonly content: string,
    readonly lessonId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly demoMember: DemoMemberResponseDto,
    readonly answers: DiscussionAnswerResponseDto[],
  ) {}
}
