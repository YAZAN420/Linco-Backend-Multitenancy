import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';
import { UpdateCourseInput } from 'src/courses/application/interfaces/update-course-input.interface';

export class UpdateCourseDto implements UpdateCourseInput {
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsEnum(CourseVisibility)
  visibility?: CourseVisibility;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imagePath?: string;

  @IsString()
  @IsOptional()
  signatureImagePath?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];
}
