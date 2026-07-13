import { CourseFaqFilter } from './courseFaq-filter.interface';

export interface FindCourseFaqsQuery extends CourseFaqFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindCourseFaqsCursorQuery extends CourseFaqFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
