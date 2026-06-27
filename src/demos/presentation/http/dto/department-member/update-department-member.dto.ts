import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobTitle } from 'src/demos/domain/enums/job-title.enum';

export class UpdateDepartmentMemberDto {
  @IsEnum(JobTitle)
  @IsNotEmpty()
  jobTitle!: JobTitle;
}
