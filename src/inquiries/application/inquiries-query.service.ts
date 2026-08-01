import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindInquiriesCursorQuery } from './interfaces/find-inquiries.query';

import { InquiryQueryRepository } from './ports/inquiry-query.repository';
import { InquiryWithDemoMember } from 'src/core/database/prisma/types';

@Injectable()
export class InquiriesQueryService {
  constructor(
    private readonly inquiryQueryRepository: InquiryQueryRepository,
  ) {}

  async findAllCursor(
    options: FindInquiriesCursorQuery,
    demoId: string,
  ): Promise<CursorPageDto<InquiryWithDemoMember>> {
    return this.inquiryQueryRepository.findAllCursor(demoId, options);
  }

  async findById(id: string, demoId: string): Promise<InquiryWithDemoMember> {
    const inquiry = await this.inquiryQueryRepository.findById(id, demoId);
    if (!inquiry) throw new NotFoundException('errors.INQUIRY_NOT_FOUND');
    return inquiry;
  }
}
