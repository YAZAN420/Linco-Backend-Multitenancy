import { InquiryStatus } from 'src/inquiries/domain/enums/inqurity-status.enum';

export interface UpdateInquiryInput {
  subject?: string;
  creatorId?: string;
  recipientId?: string;
  status?: InquiryStatus;
}
