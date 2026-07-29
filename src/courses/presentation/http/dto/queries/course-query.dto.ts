import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { CourseFilterDto } from './course-filter.dto';

export class CoursesQueryDto extends IntersectionType(
  PageOptionsDto,
  CourseFilterDto,
) {}
