import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PlanTier } from 'src/common/enums/plan-tier.enum';

export class SubscribeToDemoDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(PlanTier)
  plan!: PlanTier;
}

export class BuyCourseDto {
  @IsNotEmpty()
  @IsString()
  courseId!: string;
}
