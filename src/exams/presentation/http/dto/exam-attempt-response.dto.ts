export class ExamAttemptResponseDto {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly examId: string,
    readonly score: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
