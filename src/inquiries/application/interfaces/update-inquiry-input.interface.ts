import { InquiryStatus } from "src/generated/prisma/enums";

export interface UpdateInquiryInput {
    subject?: string;
    creatorId?: string;
    recipientId?: string;
    status?: InquiryStatus;
}
