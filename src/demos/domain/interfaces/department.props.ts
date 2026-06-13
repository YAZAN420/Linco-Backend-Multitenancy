import { Name } from '../value-objects/name.vo';

export interface DepartmentProps {
  name: Name;
  demoId: string;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
}
