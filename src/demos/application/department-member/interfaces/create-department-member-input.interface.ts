import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum';
import { JobTitle } from 'src/demos/domain/enums/job-title.enum';

export interface CreateDepartmentMemberInput {
  demoMemberId: string;
  jobTitle: JobTitle;
  role?: DepartmentMemberRole;
}
