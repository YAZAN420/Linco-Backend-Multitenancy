import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterDepartmentCoursesDto } from './filter-departmentCourses.dto';

export class FindDepartmentCoursesCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterDepartmentCoursesDto,
) {}
