import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface DepartmentMessageFilter {
  search?: string;
  createdAt?: DateFilter;
}
