import { InquiryStatus } from '../enums/inqurity-status.enum';

export interface InquiryProps {
  subject: string;
  creatorId: string;
  demoId: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}
