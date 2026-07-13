import { Injectable } from '@nestjs/common';
import { InquiryResponseDto } from '../dto/inquiry-response.dto';
import { Inquiry as PrismaInquiry } from 'src/generated/prisma/client';
import { Inquiry as DomainInquiry } from 'src/inquiries/domain/inquiry';

@Injectable()
export class InquiryResponseMapper {
  toResponseFromPrisma(inquiry: PrismaInquiry): InquiryResponseDto {
    return new InquiryResponseDto(
      inquiry.id,
      inquiry.subject,
      inquiry.demoId,
      inquiry.creatorId,
      inquiry.recipientId,
      inquiry.status,
      inquiry.createdAt,
      inquiry.updatedAt,
    );
  }

  toResponseFromDomain(inquiry: DomainInquiry): InquiryResponseDto {
    return new InquiryResponseDto(
      inquiry.id,
      inquiry.subject,
      inquiry.demoId,
      inquiry.creatorId,
      inquiry.recipientId,
      inquiry.status,
      inquiry.createdAt,
      inquiry.updatedAt,
    );
  }

  toResponseManyFromPrisma(inquiries: PrismaInquiry[]): InquiryResponseDto[] {
    return inquiries.map((inquiry) => this.toResponseFromPrisma(inquiry));
  }
}
