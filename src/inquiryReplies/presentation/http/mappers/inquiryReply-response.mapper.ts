import { Injectable } from '@nestjs/common';
import { InquiryReplyResponseDto } from '../dto/inquiryReply-response.dto';
import { InquiryReply as PrismaInquiryReply } from 'src/generated/prisma/client';
import { InquiryReply as DomainInquiryReply } from 'src/inquiryReplies/domain/inquiryReply';
import { InquirySenderType } from 'src/inquiryReplies/domain/enums/InquirySenderType';

@Injectable()
export class InquiryReplyResponseMapper {
  toResponseFromPrisma(inquiryReply: PrismaInquiryReply): InquiryReplyResponseDto {
    return new InquiryReplyResponseDto(
      inquiryReply.id,
      inquiryReply.inquiryId,
      inquiryReply.senderId,
      inquiryReply.senderType as InquirySenderType,
      inquiryReply.message,
      inquiryReply.createdAt,
      inquiryReply.updatedAt,
    );
  }

  toResponseFromDomain(inquiryReply: DomainInquiryReply): InquiryReplyResponseDto {
    return new InquiryReplyResponseDto(
      inquiryReply.id,
      inquiryReply.inquiryId,
      inquiryReply.senderId,
      inquiryReply.senderType,
      inquiryReply.message,
      inquiryReply.createdAt,
      inquiryReply.updatedAt,
    );
  }

  toResponseManyFromPrisma(inquiryReplies: PrismaInquiryReply[]): InquiryReplyResponseDto[] {
    return inquiryReplies.map((inquiryReply) => this.toResponseFromPrisma(inquiryReply));
  }
}
