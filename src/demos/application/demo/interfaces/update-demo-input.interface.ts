import { PlanTier } from 'src/common/enums/plan-tier.enum';

export interface UpdateDemoInput {
  name?: string;
  imagePath?: string;
  description?: string;
  plan?: PlanTier;
}
