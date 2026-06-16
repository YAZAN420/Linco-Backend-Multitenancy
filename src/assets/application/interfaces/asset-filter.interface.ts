import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface AssetFilter {
  search?: string;
  createdAt?: DateFilter;
}
