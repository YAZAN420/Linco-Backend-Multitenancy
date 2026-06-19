import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { UpdateSectionInput } from 'src/courses/application/interfaces/update-section-input.interface';

export class UpdateSectionDto implements UpdateSectionInput {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  order?: number;
}
