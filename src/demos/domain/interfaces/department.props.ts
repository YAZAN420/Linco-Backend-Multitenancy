import { Name } from '../value-objects/name.vo';

export interface DepartmentProps {
  name: Name;
  description: string;
  isGroup: boolean;
  demoId: string;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
}
