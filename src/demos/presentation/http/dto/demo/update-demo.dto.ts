import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UpdateDemoInput } from 'src/demos/application/demo/interfaces/update-demo-input.interface';
import { PlanTier } from 'src/common/enums/plan-tier.enum';

export class UpdateDemoDto implements UpdateDemoInput {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  imagePath?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(PlanTier)
  @IsOptional()
  plan?: PlanTier;
}
