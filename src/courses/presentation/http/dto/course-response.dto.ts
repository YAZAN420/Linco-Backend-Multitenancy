export class CourseResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly visibility: string,
    readonly authorDemoId: string | null,
    readonly price: number | null,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
