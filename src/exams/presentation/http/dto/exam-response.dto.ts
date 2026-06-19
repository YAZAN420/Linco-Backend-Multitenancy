export class ExamResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly numberOfQuestions: number,
    readonly durationMinutes: number,
    readonly sectionId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
