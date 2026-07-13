import { Injectable } from '@nestjs/common';
import type { Inquiry as PrismaInquiry} from 'src/generated/prisma/client';
import { Inquiry } from 'src/inquiries/domain/inquiry';


@Injectable()
export class PrismaInquiryMapper {
  toDomain(raw: PrismaInquiry): Inquiry {
    return new Inquiry(raw.id, {
      subject: raw.subject,
      creatorId: raw.creatorId,
      demoId: raw.demoId,
      recipientId: raw.recipientId,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(inquiry: Inquiry): PrismaInquiry {
    return {
      id: inquiry.id,
      demoId: inquiry.demoId,
      status: inquiry.status, 
      subject: inquiry.subject,
      recipientId: inquiry.recipientId,
      creatorId: inquiry.creatorId,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
    };
  }
}