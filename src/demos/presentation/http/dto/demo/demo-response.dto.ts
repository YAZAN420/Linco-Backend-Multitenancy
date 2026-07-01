import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';

export class DemoResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly imagePath: string,
    readonly description: string,
    readonly plan: PlanTier,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly subscriptionStatus?: SubscriptionStatus,
    readonly currentPeriodEnd?: Date,
    readonly ownerName?: string,
    readonly membersCount?: number,
    readonly isOwner?: boolean,
  ) {}
}
