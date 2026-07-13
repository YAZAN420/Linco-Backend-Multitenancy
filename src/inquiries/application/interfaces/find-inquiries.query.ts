import { InquiryFilter } from './inquiry-filter.interface';

export interface FindInquiriesQuery extends InquiryFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindInquiriesCursorQuery extends InquiryFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
