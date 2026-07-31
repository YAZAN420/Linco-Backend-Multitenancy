import { InquiryReplyFilter } from './inquiryReply-filter.interface';

export interface FindInquiryRepliesCursorQuery extends InquiryReplyFilter {
  cursor?: string;
  take: number;
  orderBy?: any;
}
