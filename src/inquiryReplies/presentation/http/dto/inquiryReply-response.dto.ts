import { InquirySenderType } from "src/inquiryReplies/domain/enums/InquirySenderType";

export class InquiryReplyResponseDto {
  constructor(
    readonly id: string,
    readonly inquiryId: string,
    readonly senderId: string,
    readonly senderType: InquirySenderType,
    readonly message: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
