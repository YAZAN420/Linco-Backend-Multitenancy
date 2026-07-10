import { DemoMemberResponseDto } from 'src/demos/presentation/http/dto/demo-member/demo-member-response.dto';

export class DiscussionAnswerResponseDto {
  constructor(
    readonly id: string,
    readonly content: string,
    readonly discussionId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly demoMember: DemoMemberResponseDto,
  ) {}
}
