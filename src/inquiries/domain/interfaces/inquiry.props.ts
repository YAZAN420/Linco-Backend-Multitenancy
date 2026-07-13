import { InquiryStatus } from "src/generated/prisma/enums";

export interface InquiryProps {
  subject: string;
  creatorId: string;
  recipientId: string;
  demoId: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}
