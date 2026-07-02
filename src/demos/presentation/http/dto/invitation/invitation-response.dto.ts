import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { InvitationStatus } from 'src/demos/domain/enums/invitation-status.enum';
import { DemoResponseDto } from '../demo/demo-response.dto';
import { UserResponseDto } from 'src/users/presentation/http/dto/user-response.dto';

export class InvitationResponseDto {
  constructor(
    readonly id: string,
    readonly status: InvitationStatus,
    readonly role: DemoMemberRole,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly demo?: DemoResponseDto,
    readonly sender?: UserResponseDto,
  ) {}
}
