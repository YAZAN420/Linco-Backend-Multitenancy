import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterDepartmentCoursesDto } from './filter-departmentCourses.dto';

export class FindDepartmentCoursesDto extends IntersectionType(
  PageOptionsDto,
  FilterDepartmentCoursesDto,
) {}
