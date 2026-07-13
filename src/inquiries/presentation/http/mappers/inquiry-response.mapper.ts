import { Injectable } from '@nestjs/common';
import { InquiryResponseDto } from '../dto/inquiry-response.dto';
import { Inquiry as PrismaInquiry } from 'src/generated/prisma/client';
import { InquiryStatus } from 'src/inquiries/domain/enums/inqurity-status.enum';

@Injectable()
export class InquiryResponseMapper {
  toResponseFromPrisma(inquiry: PrismaInquiry): InquiryResponseDto {
    return new InquiryResponseDto(
      inquiry.id,
      inquiry.subject,
      inquiry.demoId,
      inquiry.creatorId,
      inquiry.recipientId,
      inquiry.status as InquiryStatus,
      inquiry.createdAt,
      inquiry.updatedAt,
    );
  }

  toResponseManyFromPrisma(inquiries: PrismaInquiry[]): InquiryResponseDto[] {
    return inquiries.map((inquiry) => this.toResponseFromPrisma(inquiry));
  }
}
