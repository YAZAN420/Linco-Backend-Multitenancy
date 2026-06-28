import { PlanTier } from 'src/demos/domain/enums/plan-tier.enum';

export interface CreateDemoInput {
  name: string;
  imagePath: string;
  description: string;
  ownerId: string;
  plan: PlanTier;
}
