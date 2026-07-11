import { DateFilter } from 'src/common/interfaces/date-filter.interface';

export interface UserFilter {
  search?: string;
  createdAt?: DateFilter;
}
