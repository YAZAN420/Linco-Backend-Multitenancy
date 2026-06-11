import { CourseFilter } from './course-filter.interface';

export interface FindSectionsCursorQuery extends CourseFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
