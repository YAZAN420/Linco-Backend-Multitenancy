import { Department } from '../department';
import { PlanTier } from '../../../common/enums/plan-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';
import { Name } from '../value-objects/name.vo';

export interface DemoProps {
  name: Name;
  imagePath: string;
  description: string;
  ownerId: string;
  plan: PlanTier;
  departments: Department[];
  stripeSubscriptionId?: string;
  subscriptionStatus?: SubscriptionStatus;
  currentPeriodEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}
