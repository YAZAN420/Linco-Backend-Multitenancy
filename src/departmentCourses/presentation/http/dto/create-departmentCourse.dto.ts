import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDepartmentCourseInput } from 'src/departmentCourses/application/interfaces/create-departmentCourse-input.interface';

export class CreateDepartmentCourseDto implements CreateDepartmentCourseInput {
  @IsString()
  @IsNotEmpty()
  assetId!: string;
}
