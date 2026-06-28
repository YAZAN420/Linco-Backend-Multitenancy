import { PlanTier } from 'src/demos/domain/enums/plan-tier.enum';

export interface UpdateDemoInput {
  name?: string;
  imagePath?: string;
  description?: string;
  plan?: PlanTier;
}
