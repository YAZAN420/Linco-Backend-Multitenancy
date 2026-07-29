import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface CourseFilter {
  search?: string;
  tagIds?: string[];
  createdAt?: DateFilter;
}
