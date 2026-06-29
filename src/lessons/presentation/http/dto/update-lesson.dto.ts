import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateLessonInput } from 'src/lessons/application/interfaces/update-lesson-input.interface';

export class UpdateLessonDto implements UpdateLessonInput {
  @IsString()
  @IsOptional()
  title?: string;
  @IsNumber()
  @IsOptional()
  order?: number;
  @IsString()
  @IsOptional()
  videoUrl?: string;
  @IsString()
  @IsOptional()
  description?: string;
  @IsNumber()
  @IsOptional()
  duration?: number;
  @IsString()
  @IsOptional()
  subTitleUrl?: string;
}
