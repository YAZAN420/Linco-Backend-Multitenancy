import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface CourseFaqFilter {
  search?: string;
  createdAt?: DateFilter;
}
