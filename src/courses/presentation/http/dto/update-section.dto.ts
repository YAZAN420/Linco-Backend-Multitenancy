import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateSectionInput } from 'src/courses/application/interfaces/update-section-input.interface';

export class UpdateSectionDto implements UpdateSectionInput {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  order?: number;
}
