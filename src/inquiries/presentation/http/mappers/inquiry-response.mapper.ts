import { Injectable } from '@nestjs/common';
import { InquiryResponseDto } from '../dto/inquiry-response.dto';

import { InquiryStatus } from 'src/inquiries/domain/enums/inqurity-status.enum';
import { InquiryWithDemoMember } from 'src/core/database/prisma/types';
import { DemoMemberResponseMapper } from 'src/demos/presentation/http/mappers/demo-member-response.mapper';

@Injectable()
export class InquiryResponseMapper {
  constructor(
    private readonly demoMemberResponseMapper: DemoMemberResponseMapper,
  ) {}
  toResponseFromPrisma(inquiry: InquiryWithDemoMember): InquiryResponseDto {
    return new InquiryResponseDto(
      inquiry.id,
      inquiry.subject,
      inquiry.message,
      inquiry.demoId,
      inquiry.status as InquiryStatus,
      inquiry.createdAt,
      inquiry.updatedAt,
      this.demoMemberResponseMapper.toResponseFromPrisma(inquiry.creator),
    );
  }

  toResponseManyFromPrisma(
    inquiries: InquiryWithDemoMember[],
  ): InquiryResponseDto[] {
    return inquiries.map((inquiry) => this.toResponseFromPrisma(inquiry));
  }
}
