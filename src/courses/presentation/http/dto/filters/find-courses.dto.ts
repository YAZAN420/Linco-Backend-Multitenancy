import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { FilterCoursesDto } from './filter-courses.dto';

export class FindCoursesDto extends IntersectionType(
  PageOptionsDto,
  FilterCoursesDto,
) {}
