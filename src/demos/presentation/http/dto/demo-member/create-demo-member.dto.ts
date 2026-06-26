import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';

export class CreateDemoMemberDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(DemoMemberRole)
  @IsNotEmpty()
  role!: DemoMemberRole;
}
