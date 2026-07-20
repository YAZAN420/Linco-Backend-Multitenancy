import { InquiryMessage } from 'src/inquiryMessages/domain/inquiryMessage';

export abstract class InquiryMessageCommandRepository {
  abstract save(inquiryMessage: InquiryMessage): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<InquiryMessage | null>;
}
