import { Injectable } from '@nestjs/common';
import type { InquiryReply as PrismaInquiryReply } from 'src/generated/prisma/client';
import { InquirySenderType } from 'src/inquiryReplies/domain/enums/InquirySenderType';
import { InquiryReply } from 'src/inquiryReplies/domain/inquiryReply';

@Injectable()
export class PrismaInquiryReplyMapper {
  toDomain(raw: PrismaInquiryReply): InquiryReply {
    return new InquiryReply(raw.id, {
      senderId: raw.senderId,
      message: raw.message,
      inquiryId: raw.inquiryId,
      senderType: raw.senderType as InquirySenderType,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(inquiryReply: InquiryReply): PrismaInquiryReply {
    return {
      id: inquiryReply.id,
      message: inquiryReply.message,
      senderId: inquiryReply.senderId,
      senderType: inquiryReply.senderType,
      inquiryId: inquiryReply.inquiryId,
      createdAt: inquiryReply.createdAt,
      updatedAt: inquiryReply.updatedAt,
    };
  }
}
