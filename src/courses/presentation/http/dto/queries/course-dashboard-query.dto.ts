import { IntersectionType } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dtos/pagination';
import { CourseDashboardFilterDto } from './course-dashboard-filter.dto';

export class CourseDashboardQueryDto extends IntersectionType(
  PageOptionsDto,
  CourseDashboardFilterDto,
) {}
