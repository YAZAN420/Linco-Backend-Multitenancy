export class DemoMemberResponseDto {
  constructor(
    readonly id: string,
    readonly demoId: string,
    readonly userId: string,
    readonly role: string,
    readonly joinedAt: Date,
    readonly updatedAt: Date,
  ) {}
}
