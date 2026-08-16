import { IsEnum, IsNotEmpty, NotEquals } from 'class-validator';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

export class UpdateDemoMemberDto {
  @IsEnum(DemoMemberRole)
  @IsNotEmpty()
  @NotEquals(DemoMemberRole.OWNER)
  role!: DemoMemberRole;
}
