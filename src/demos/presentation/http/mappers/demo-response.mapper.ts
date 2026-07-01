import { Injectable } from '@nestjs/common';
import { DemoResponseDto } from '../dto/demo/demo-response.dto';

import { Demo as DomainDemo } from 'src/demos/domain/demo';

import { DemoWithOwnership } from 'src/core/database/prisma/types';
import { PlanTier } from 'src/common/enums/plan-tier.enum';
import { Demo } from 'src/generated/prisma/client';
import { SubscriptionStatus } from 'src/demos/domain/enums/subscription-status.enum';

@Injectable()
export class DemoResponseMapper {
  constructor() {}

  toSimpleResponseFromPrisma(demo: Demo): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.imagePath,
      demo.description,
      demo.plan as PlanTier,
      demo.createdAt,
      demo.updatedAt,
      demo.subscriptionStatus as SubscriptionStatus,
      demo.currentPeriodEnd ?? undefined,
    );
  }

  toResponseFromPrisma(demo: DemoWithOwnership): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.imagePath,
      demo.description,
      demo.plan as PlanTier,
      demo.createdAt,
      demo.updatedAt,
      demo.subscriptionStatus as SubscriptionStatus,
      demo.currentPeriodEnd ?? undefined,
      demo.owner.firstName + ' ' + demo.owner.lastName,
      demo._count.members,
      demo.isOwner,
    );
  }

  toResponseFromDomain(demo: DomainDemo): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.imagePath,
      demo.description,
      demo.plan,
      demo.createdAt,
      demo.updatedAt,
      demo.subscriptionStatus as SubscriptionStatus,
      demo.currentPeriodEnd ?? undefined,
    );
  }

  toResponseManyFromPrisma(demos: DemoWithOwnership[]): DemoResponseDto[] {
    return demos.map((demo) => this.toResponseFromPrisma(demo));
  }
}
