import { InquiryStatus } from 'src/inquiries/domain/enums/inqurity-status.enum';

export interface UpdateInquiryInput {
  subject?: string;
  message?: string;
  status?: InquiryStatus;
}
