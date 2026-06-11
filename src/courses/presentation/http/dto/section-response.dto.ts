export class SectionResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly order: number,
    readonly courseId: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
