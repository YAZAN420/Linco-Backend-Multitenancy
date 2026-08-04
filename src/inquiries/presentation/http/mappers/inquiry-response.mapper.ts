import { Injectable } from '@nestjs/common';
import { InquiryResponseDto } from '../dto/inquiry-response.dto';

import { InquiryStatus } from 'src/inquiries/domain/enums/inqurity-status.enum';
import { InquiryReplyWithDemoMember, InquiryWithDemoMember, InquiryWithReply } from 'src/core/database/prisma/types';
import { DemoMemberResponseMapper } from 'src/demos/presentation/http/mappers/demo-member-response.mapper';
import { InquiryReplyResponseMapper } from 'src/inquiryReplies/presentation/http/mappers/inquiryReply-response.mapper';

@Injectable()
export class InquiryResponseMapper {
  constructor(
    private readonly demoMemberResponseMapper: DemoMemberResponseMapper,
    private readonly inquiryReplyResponseMapper: InquiryReplyResponseMapper
  ) {}
  toResponseFromPrisma(inquiry: InquiryWithReply): InquiryResponseDto {
    return new InquiryResponseDto(
      inquiry.id,
      inquiry.subject,
      inquiry.message,
      inquiry.demoId,
      inquiry.status as InquiryStatus,
      inquiry.createdAt,
      inquiry.updatedAt,
      this.demoMemberResponseMapper.toResponseFromPrisma(inquiry.creator),
      inquiry.reply ? this.inquiryReplyResponseMapper.toResponseFromPrisma(inquiry.reply as InquiryReplyWithDemoMember) : undefined,
    );
  }

  toResponseManyFromPrisma(
    inquiries: InquiryWithReply[],
  ): InquiryResponseDto[] {
    return inquiries.map((inquiry) => this.toResponseFromPrisma(inquiry));
  }
}
