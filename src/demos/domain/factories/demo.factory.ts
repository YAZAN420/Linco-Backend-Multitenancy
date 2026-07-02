import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Demo } from '../demo';
import { Name } from '../value-objects/name.vo';
import { PlanTier } from '../../../common/enums/plan-tier.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@Injectable()
export class DemoFactory {
  createNew(
    name: string,
    ownerId: string,
    imagePath: string,
    description: string,
  ): Demo {
    const now = new Date();
    const nameVo = Name.create(name);

    const trialDays = 14;
    const currentPeriodEnd = new Date(
      now.getTime() + trialDays * 24 * 60 * 60 * 1000,
    );

    return new Demo(uuidv7(), {
      name: nameVo,
      imagePath,
      description,
      ownerId,
      subscriptionStatus: SubscriptionStatus.TRIALING,
      plan: PlanTier.FREE,
      stripeSubscriptionId: undefined,
      currentPeriodEnd: currentPeriodEnd,
      departments: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
