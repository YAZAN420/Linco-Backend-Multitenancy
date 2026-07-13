import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface InquiryFilter {
  search?: string;
  createdAt?: DateFilter;
}
