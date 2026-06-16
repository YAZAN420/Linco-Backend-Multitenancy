import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';
import { UpdateCourseInput } from 'src/courses/application/interfaces/update-course-input.interface';

export class UpdateCourseDto implements UpdateCourseInput {
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsEnum(CourseVisibility)
  visibility?: CourseVisibility;

  @IsNumber()
  @IsOptional()
  price?: number;
}
