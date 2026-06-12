import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UpdateLessonInput } from 'src/lessons/application/interfaces/update-lesson-input.interface';

export class UpdateLessonDto implements UpdateLessonInput {
  @IsString()
  @IsOptional()
  title!: string | null;
  @IsNumber()
  @IsOptional()
  order!: number | null;
  @IsString()
  @IsOptional()
  videoUrl!: string | null;
  @IsString()
  @IsOptional()
  subTitleUrl!: string | null;
}
