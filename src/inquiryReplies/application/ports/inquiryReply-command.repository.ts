import { InquiryReply } from 'src/inquiryReplies/domain/inquiryReply';

export abstract class InquiryReplyCommandRepository {
  abstract save(inquiryReply: InquiryReply): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<InquiryReply | null>;
}
