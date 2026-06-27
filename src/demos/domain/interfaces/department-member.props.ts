import { JobTitle } from '../enums/job-title.enum';

export interface DepartmentMemberProps {
  departmentId: string;
  demoMemberId: string;
  jobTitle: JobTitle;
  assignedAt: Date;
  updatedAt: Date;
}
