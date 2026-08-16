import { IsEnum, IsNotEmpty, IsString, NotEquals } from 'class-validator';

import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

export class CreateInvitationDto {
  @IsString()
  @IsNotEmpty()
  receiverId!: string;
  @IsNotEmpty()
  @IsEnum(DemoMemberRole)
  @NotEquals(DemoMemberRole.OWNER)
  role!: DemoMemberRole;
}
