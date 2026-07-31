import { InquiryReplyFilter } from './inquiryReply-filter.interface';

export interface FindInquiryRepliesQuery extends InquiryReplyFilter {
  page: number;
  take: number;
  orderBy?: any;
}

export interface FindInquiryRepliesCursorQuery extends InquiryReplyFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
