import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { JobTitle } from 'src/demos/domain/enums/job-title.enum';

export class CreateDepartmentMemberDto {
  @IsString()
  @IsNotEmpty()
  demoMemberId!: string;

  @IsEnum(JobTitle)
  @IsNotEmpty()
  jobTitle!: JobTitle;
}
