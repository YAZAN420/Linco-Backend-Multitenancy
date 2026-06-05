import { Department } from '../department';

export interface DemoProps {
  name: string;
  ownerId: string;
  departments: Department[];
  createdAt: Date;
  updatedAt: Date;
}
