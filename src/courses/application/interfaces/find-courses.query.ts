import { CourseFilter } from './course-filter.interface';

export interface FindCoursesQuery extends CourseFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindCoursesCursorQuery extends CourseFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
