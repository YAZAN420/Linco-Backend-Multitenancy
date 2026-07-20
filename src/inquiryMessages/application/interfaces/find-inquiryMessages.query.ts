import { InquiryMessageFilter } from './inquiryMessage-filter.interface';

export interface FindInquiryMessagesQuery extends InquiryMessageFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindInquiryMessagesCursorQuery extends InquiryMessageFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
