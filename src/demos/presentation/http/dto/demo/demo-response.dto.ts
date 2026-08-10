import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';

export class DemoResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly imagePath: string,
    readonly signatureImagePath: string,
    readonly description: string,
    readonly plan: PlanTier,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly currentPeriodEnd: Date,
    readonly subscriptionStatus?: SubscriptionStatus,
    readonly ownerName?: string,
    readonly membersCount?: number,
    readonly isOwner?: boolean,
  ) {}
}
