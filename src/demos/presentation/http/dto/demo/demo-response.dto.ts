import { PlanTier } from 'src/demos/domain/enums/plan-tier.enum';

export class DemoResponseDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly imagePath: string,
    readonly description: string,
    readonly plan: PlanTier,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly membersCount?: number,
    readonly isOwner?: boolean,
  ) {}
}
