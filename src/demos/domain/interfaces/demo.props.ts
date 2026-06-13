import { Department } from '../department';
import { Name } from '../value-objects/name.vo';

export interface DemoProps {
  name: Name;
  ownerId: string;
  departments: Department[];
  createdAt: Date;
  updatedAt: Date;
}
