import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Demo } from '../demo';
import { Name } from '../value-objects/name.vo';
import { PlanTier } from '../enums/plan-tier.enum';

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
    return new Demo(uuidv7(), {
      name: nameVo,
      imagePath,
      description,
      ownerId,
      plan,
      departments: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
