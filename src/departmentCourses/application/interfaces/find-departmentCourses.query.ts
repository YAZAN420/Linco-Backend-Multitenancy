import { DepartmentCourseFilter } from './departmentCourse-filter.interface';

export interface FindDepartmentCoursesQuery extends DepartmentCourseFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindDepartmentCoursesCursorQuery extends DepartmentCourseFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
