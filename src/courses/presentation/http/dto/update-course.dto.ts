import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';
import { UpdateCourseInput } from 'src/courses/application/interfaces/update-course-input.interface';

export class UpdateCourseDto implements UpdateCourseInput {
  @IsString()
  @IsOptional()
  title!: string | null;

  @IsOptional()
  @IsEnum(CourseVisibility)
  visibility!: CourseVisibility | null;

  @IsNumber()
  @IsOptional()
  price!: number | null;
}
