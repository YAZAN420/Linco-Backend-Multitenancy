import { Injectable } from '@nestjs/common';
import { InquiryReplyResponseDto } from '../dto/inquiryReply-response.dto';

import { InquirySenderType } from 'src/inquiryReplies/domain/enums/InquirySenderType';
import { InquiryReplyWithDemoMember } from 'src/core/database/prisma/types';
import { DemoMemberResponseMapper } from 'src/demos/presentation/http/mappers/demo-member-response.mapper';

@Injectable()
export class InquiryReplyResponseMapper {
  constructor(
    private readonly demoMemberResponseMapper: DemoMemberResponseMapper,
  ) {}
  toResponseFromPrisma(
    inquiryReply: InquiryReplyWithDemoMember,
  ): InquiryReplyResponseDto {
    return new InquiryReplyResponseDto(
      inquiryReply.id,
      inquiryReply.inquiryId,
      inquiryReply.senderType as InquirySenderType,
      inquiryReply.message,
      inquiryReply.createdAt,
      inquiryReply.updatedAt,
      this.demoMemberResponseMapper.toResponseFromPrisma(inquiryReply.sender),
    );
  }

  toResponseManyFromPrisma(
    inquiryReplies: InquiryReplyWithDemoMember[],
  ): InquiryReplyResponseDto[] {
    return inquiryReplies.map((inquiryReply) =>
      this.toResponseFromPrisma(inquiryReply),
    );
  }
}
