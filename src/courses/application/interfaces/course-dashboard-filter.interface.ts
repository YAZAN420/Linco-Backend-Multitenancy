import { CourseVisibility } from 'src/generated/prisma/client';
import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface CourseDashboardFilter {
  search?: string;
  isPublished?: boolean;
  visibility?: CourseVisibility;
  demoId?: string;
  tagIds?: string[];
  createdAt?: DateFilter;
}
