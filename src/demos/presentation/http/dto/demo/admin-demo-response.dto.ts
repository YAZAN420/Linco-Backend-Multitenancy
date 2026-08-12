import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';

export class AdminDemoResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly imagePath: string,
    readonly plan: PlanTier,
    readonly membersCount: number,
    readonly departmentsCount: number,
    readonly createdAt: Date,
    readonly subscriptionStatus: SubscriptionStatus,
  ) {}
}
