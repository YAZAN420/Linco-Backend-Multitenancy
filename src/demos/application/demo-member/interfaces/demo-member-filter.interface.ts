import { DateFilter } from 'src/common/interfaces/date-filter.interface';

export interface DemoMemberFilter {
  search?: string;
  createdAt?: DateFilter;
}
