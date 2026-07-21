import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

export class CreateInvitationDto {
  @IsString()
  @IsNotEmpty()
  receiverId!: string;
  @IsNotEmpty()
  @IsEnum(DemoMemberRole)
  role!: DemoMemberRole;
}
