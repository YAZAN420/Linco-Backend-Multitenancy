export class LessonResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly order: number,
    readonly videoUrl: string,
    readonly subTitleUrl: string | null,
    readonly sectionId: string,
    readonly duration: number,
    readonly description: string,
    readonly attachmentCount: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
