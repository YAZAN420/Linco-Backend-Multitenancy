import { Injectable } from '@nestjs/common';
import type { Demo as PrismaDemo } from 'src/generated/prisma/client';
import { Demo } from 'src/demos/domain/demo';
import { PrismaDepartmentMapper } from './prisma-department.mapper';
import { DemoWithDepartments } from 'src/core/database/prisma/types';
import { Name } from 'src/demos/domain/value-objects/name.vo';
import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';

@Injectable()
export class PrismaDemoMapper {
  constructor(private readonly departmentMapper: PrismaDepartmentMapper) {}

  toDomain(raw: DemoWithDepartments): Demo {
    const nameVo = Name.create(raw.name);
    return new Demo(raw.id, {
      name: nameVo,
      imagePath: raw.imagePath,
      signatureImagePath: raw.signatureImagePath,
      description: raw.description,
      ownerId: raw.ownerId,
      plan: raw.plan as PlanTier,
      subscriptionStatus: raw.subscriptionStatus as SubscriptionStatus,
      stripeSubscriptionId: raw.stripeSubscriptionId ?? undefined,
      currentPeriodEnd: raw.currentPeriodEnd ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      departments: raw.departments
        ? raw.departments.map((dept) => this.departmentMapper.toDomain(dept))
        : [],
    });
  }

  toPersistence(demo: Demo): PrismaDemo {
    return {
      id: demo.id,
      name: demo.name,
      imagePath: demo.imagePath,
      signatureImagePath: demo.signatureImagePath,
      plan: demo.plan,
      subscriptionStatus: demo.subscriptionStatus,
      stripeSubscriptionId: demo.stripeSubscriptionId ?? null,
      currentPeriodEnd: demo.currentPeriodEnd ?? null,
      description: demo.description,
      ownerId: demo.ownerId,
      createdAt: demo.createdAt,
      updatedAt: demo.updatedAt,
    };
  }
}
