import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

export class DemoMemberResponseDto {
  constructor(
    readonly id: string,
    readonly demoId: string,
    readonly userId: string,
    readonly role: DemoMemberRole,
    readonly joinedAt: Date,
    readonly updatedAt: Date,
  ) {}
}
