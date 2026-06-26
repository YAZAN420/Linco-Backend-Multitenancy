export class DemoResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly imagePath: string,
    readonly description: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly membersCount?: number,
  ) {}
}
