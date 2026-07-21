import { Inquiry } from 'src/inquiries/domain/inquiry';

export abstract class InquiryCommandRepository {
  abstract save(inquiry: Inquiry): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string, demoId: string): Promise<Inquiry | null>;
}
