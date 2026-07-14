import { DepartmentMemberRole } from '../enums/department-member-role.enum copy';
import { JobTitle } from '../enums/job-title.enum';

export interface DepartmentMemberProps {
  departmentId: string;
  demoMemberId: string;
  role: DepartmentMemberRole;
  jobTitle: JobTitle;
  assignedAt: Date;
  updatedAt: Date;
}
