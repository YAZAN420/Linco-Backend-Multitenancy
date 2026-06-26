import { DateFilter } from 'src/common/interfaces/date-filter.interface';

export interface DemoFilter {
  search?: string;
  createdAt?: DateFilter;
}
