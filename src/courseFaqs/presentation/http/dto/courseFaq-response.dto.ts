export class CourseFaqResponseDto {
  constructor(
    readonly id: string,
    readonly question: string,
    readonly answer: string,
    readonly courseId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
