export class QuestionsBankResponseDto {
  constructor(
    readonly id: string,
    readonly sectionId: string,
    readonly text: string,
    readonly numberOfQuestions: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
