import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { CreateSectionInput } from 'src/courses/application/interfaces/create-section-input.interface';

export class CreateSectionDto implements CreateSectionInput {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(50)
  order!: number;
}
