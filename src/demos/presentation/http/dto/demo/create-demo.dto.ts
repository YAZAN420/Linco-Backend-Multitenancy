import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlanTier } from 'src/common/enums/plan-tier.enum';

export class CreateDemoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  imagePath!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(PlanTier)
  @IsNotEmpty()
  plan!: PlanTier;
}
