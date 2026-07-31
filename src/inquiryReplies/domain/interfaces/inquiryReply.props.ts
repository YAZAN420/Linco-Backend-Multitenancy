import { InquirySenderType } from "../enums/InquirySenderType";

export interface InquiryReplyProps {
  inquiryId: string;
  senderId: string;
  senderType: InquirySenderType;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
