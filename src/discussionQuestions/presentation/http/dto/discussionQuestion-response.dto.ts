export class DiscussionQuestionResponseDto {
  constructor(
    readonly id: string,
    readonly content: string,
    readonly lessonId: string,
    readonly demoMemberId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
