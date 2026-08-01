import { InquiryFilter } from './inquiry-filter.interface';

export interface FindInquiriesCursorQuery extends InquiryFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
