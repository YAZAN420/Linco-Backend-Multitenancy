import { IntersectionType } from '@nestjs/swagger';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { CourseFilterDto } from './course-filter.dto';

export class CoursesCursorQueryDto extends IntersectionType(
  CursorPageOptionsDto,
  CourseFilterDto,
) {}
