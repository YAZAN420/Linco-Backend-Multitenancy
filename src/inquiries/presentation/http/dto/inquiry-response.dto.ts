import { InquiryStatus } from "src/generated/prisma/enums";

export class InquiryResponseDto {
  constructor(
    readonly id: string,
    readonly subject: string,
    readonly demoId: string,
    readonly creatorId: string,
    readonly recipientId: string,
    readonly status: InquiryStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
