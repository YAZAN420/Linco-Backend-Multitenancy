import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateLessonInput } from 'src/lessons/application/interfaces/create-lesson-input.interface';

export class CreateLessonDto implements CreateLessonInput {
  @IsString()
  @IsNotEmpty()
  title!: string;
  @IsNumber()
  @IsNotEmpty()
  order!: number;
  @IsString()
  @IsNotEmpty()
  videoUrl!: string;
  @IsString()
  @IsOptional()
  subTitleUrl?: string;
}
