import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { FilterCoursesDto } from './filter-courses.dto';

export class FindCoursesCursorDto extends IntersectionType(
  CursorPageOptionsDto,
  FilterCoursesDto,
) {}
