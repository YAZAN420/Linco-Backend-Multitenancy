import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface SectionFilter {
  search?: string;
  createdAt?: DateFilter;
}
