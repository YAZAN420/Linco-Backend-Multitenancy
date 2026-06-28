import { Injectable } from '@nestjs/common';
import { DemoResponseDto } from '../dto/demo/demo-response.dto';

import { Demo as DomainDemo } from 'src/demos/domain/demo';

import { DemoWithOwnership } from 'src/core/database/prisma/types';
import { PlanTier } from 'src/demos/domain/enums/plan-tier.enum';

@Injectable()
export class DemoResponseMapper {
  constructor() {}

  toResponseFromPrisma(demo: DemoWithOwnership): DemoResponseDto {
    return new DemoResponseDto(
      demo.id,
      demo.name,
      demo.imagePath,
      demo.description,
      demo.plan as PlanTier,
      demo.createdAt,
      demo.updatedAt,
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
    );
  }

  toResponseManyFromPrisma(demos: DemoWithOwnership[]): DemoResponseDto[] {
    return demos.map((demo) => this.toResponseFromPrisma(demo));
  }
}
