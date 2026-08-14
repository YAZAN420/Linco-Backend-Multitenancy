import { CourseDashboardFilter } from './course-dashboard-filter.interface';

export interface FindCoursesDashboardQuery extends CourseDashboardFilter {
  page: number;
  take: number;
  orderBy?: any;
}
