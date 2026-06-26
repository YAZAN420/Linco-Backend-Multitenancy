import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { UserResponseDto } from 'src/users/presentation/http/dto/user-response.dto';

export class DemoMemberResponseDto {
  constructor(
    readonly id: string,
    readonly demoId: string,
    readonly userId: string,
    readonly role: DemoMemberRole,
    readonly joinedAt: Date,
    readonly updatedAt: Date,
    readonly user: UserResponseDto,
  ) {}
}
