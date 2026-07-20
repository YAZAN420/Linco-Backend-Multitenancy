import { Injectable } from '@nestjs/common';
import { InquiryMessageResponseDto } from '../dto/inquiryMessage-response.dto';
import { InquiryMessage as PrismaInquiryMessage } from 'src/generated/prisma/client';
import { InquiryMessage as DomainInquiryMessage } from 'src/inquiryMessages/domain/inquiryMessage';

@Injectable()
export class InquiryMessageResponseMapper {
  toResponseFromPrisma(
    inquiryMessage: PrismaInquiryMessage,
  ): InquiryMessageResponseDto {
    return new InquiryMessageResponseDto(
      inquiryMessage.id,
      inquiryMessage.senderId,
      inquiryMessage.inquiryId,
      inquiryMessage.message,
      inquiryMessage.createdAt,
      inquiryMessage.updatedAt,
    );
  }

  toResponseFromDomain(
    inquiryMessage: DomainInquiryMessage,
  ): InquiryMessageResponseDto {
    return new InquiryMessageResponseDto(
      inquiryMessage.id,
      inquiryMessage.senderId,
      inquiryMessage.message,
      inquiryMessage.inquiryId,
      inquiryMessage.createdAt,
      inquiryMessage.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    inquiryMessages: PrismaInquiryMessage[],
  ): InquiryMessageResponseDto[] {
    return inquiryMessages.map((inquiryMessage) =>
      this.toResponseFromPrisma(inquiryMessage),
    );
  }
}
