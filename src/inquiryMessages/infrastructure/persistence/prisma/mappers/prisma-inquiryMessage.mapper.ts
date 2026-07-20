import { Injectable } from '@nestjs/common';
import type { InquiryMessage as PrismaInquiryMessage } from 'src/generated/prisma/client';
import { InquiryMessage } from 'src/inquiryMessages/domain/inquiryMessage';

@Injectable()
export class PrismaInquiryMessageMapper {
  toDomain(raw: PrismaInquiryMessage): InquiryMessage {
    return new InquiryMessage(raw.id, {
      senderId: raw.senderId,
      inquiryId: raw.inquiryId,
      message: raw.message,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(inquiryMessage: InquiryMessage): PrismaInquiryMessage {
    return {
      id: inquiryMessage.id,
      senderId: inquiryMessage.senderId,
      message: inquiryMessage.message,
      inquiryId: inquiryMessage.inquiryId,
      createdAt: inquiryMessage.createdAt,
      updatedAt: inquiryMessage.updatedAt,
    };
  }
}
