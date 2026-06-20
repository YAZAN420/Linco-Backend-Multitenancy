export class QuestionsBankResponseDto {
  constructor(
    readonly id: string,
    readonly sectionId: string,
    readonly choices: [string, boolean][],
    readonly text: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
