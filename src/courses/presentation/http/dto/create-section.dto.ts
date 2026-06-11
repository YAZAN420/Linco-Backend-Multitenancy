import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateSectionInput } from 'src/courses/application/interfaces/create-section-input.interface';

export class CreateSectionDto implements CreateSectionInput {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNumber()
  @IsNotEmpty()
  order!: number;

  @IsString()
  @IsOptional()
  courseId!: string;
}
