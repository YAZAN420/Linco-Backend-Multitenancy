import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface DepartmentCourseFilter {
  search?: string;
  createdAt?: DateFilter;
}
