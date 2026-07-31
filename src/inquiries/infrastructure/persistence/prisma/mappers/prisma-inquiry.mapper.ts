import { Injectable } from '@nestjs/common';
import { InquiryStatus } from 'src/inquiries/domain/enums/inqurity-status.enum';
import type { Inquiry as PrismaInquiry } from 'src/generated/prisma/client';
import { Inquiry } from 'src/inquiries/domain/inquiry';

@Injectable()
export class PrismaInquiryMapper {
  toDomain(raw: PrismaInquiry): Inquiry {
    return new Inquiry(raw.id, {
      subject: raw.subject,
      message: raw.message,
      creatorId: raw.creatorId,
      demoId: raw.demoId,
      status: raw.status as InquiryStatus,
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
      message: inquiry.message,
      creatorId: inquiry.creatorId,
      createdAt: inquiry.createdAt,
      updatedAt: inquiry.updatedAt,
    };
  }
}
