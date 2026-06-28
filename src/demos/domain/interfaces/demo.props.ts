import { Department } from '../department';
import { PlanTier } from '../enums/plan-tier.enum';
import { Name } from '../value-objects/name.vo';

export interface DemoProps {
  name: Name;
  imagePath: string;
  description: string;
  ownerId: string;
  plan: PlanTier;
  departments: Department[];
  createdAt: Date;
  updatedAt: Date;
}
