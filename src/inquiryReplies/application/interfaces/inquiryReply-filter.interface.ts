import { DateFilter } from '../../../common/interfaces/date-filter.interface';

export interface InquiryReplyFilter {
  search?: string;
  createdAt?: DateFilter;
}
