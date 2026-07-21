import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum';

export interface ActiveDepartmentMemberData {
  id: string;
  userId: string;
  demoId: string;
  departmentId: string;
  role: DepartmentMemberRole;
}
