export class SectionResponseDto {
  constructor(
    readonly id: string,
    readonly courseId: string,
    readonly title: string,
    readonly order: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
