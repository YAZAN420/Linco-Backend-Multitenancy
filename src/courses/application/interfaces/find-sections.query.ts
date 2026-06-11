import { CourseFilter } from './course-filter.interface';

export interface FindSectionsQuery extends CourseFilter {
  page: number;
  take: number;
  orderBy?: any;
  with?: string[];
}

export interface FindSectionsCursorQuery extends CourseFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
  with?: string[];
}
