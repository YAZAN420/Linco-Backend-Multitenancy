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
    plan: PlanTier,
  ): Demo {
    const now = new Date();
    const nameVo = Name.create(name);

    const subscriptionStatus =
      plan === PlanTier.STARTER ? undefined : SubscriptionStatus.INACTIVE;

    return new Demo(uuidv7(), {
      name: nameVo,
      imagePath,
      description,
      ownerId,
      plan,
      subscriptionStatus,
      stripeSubscriptionId: undefined,
      currentPeriodEnd: undefined,
      departments: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
