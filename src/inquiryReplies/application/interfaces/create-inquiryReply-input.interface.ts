import { InquirySenderType } from "src/inquiryReplies/domain/enums/InquirySenderType";

export interface CreateInquiryReplyInput {
    message: string;
    inquiryId: string;
    senderId: string;
    senderType: InquirySenderType
}
