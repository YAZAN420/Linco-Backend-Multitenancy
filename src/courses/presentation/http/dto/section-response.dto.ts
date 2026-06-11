export class SectionResponseDto {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly order: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
