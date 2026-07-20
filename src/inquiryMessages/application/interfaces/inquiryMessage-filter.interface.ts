import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface InquiryMessageFilter {
  search?: string;
  createdAt?: DateFilter;
}
