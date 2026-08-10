import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateCourseInput } from 'src/courses/application/interfaces/create-course-input.interface';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

export class CreateCourseDto implements CreateCourseInput {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsNotEmpty()
  @IsEnum(CourseVisibility)
  visibility!: CourseVisibility;

  @IsString()
  @IsNotEmpty()
  demoId!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  imagePath!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];
}
