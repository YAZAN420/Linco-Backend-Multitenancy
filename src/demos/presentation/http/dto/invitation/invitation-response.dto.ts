import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { InvitationStatus } from 'src/demos/domain/enums/invitation-status.enum';

export class InvitationResponseDto {
  constructor(
    readonly id: string,
    readonly status: InvitationStatus,
    readonly role: DemoMemberRole,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
