export class LessonResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly order: number,
    readonly videoUrl: string,
    readonly subTitleUrl: string | null,
    readonly sectionId: string,
    readonly courseId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
