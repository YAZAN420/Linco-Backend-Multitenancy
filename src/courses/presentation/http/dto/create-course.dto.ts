import {
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
  @IsOptional()
  authorDemoId!: string | null;

  @IsNumber()
  @IsOptional()
  price!: number | null;
}
