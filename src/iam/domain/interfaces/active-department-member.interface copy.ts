import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum copy';

export interface ActiveDepartmentMemberData {
  id: string;
  userId: string;
  demoId: string;
  departmentId: string;
  role: DepartmentMemberRole;
}
