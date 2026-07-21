import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindInquiriesCursorQuery } from './interfaces/find-inquiries.query';
import { Inquiry } from 'src/generated/prisma/client';
import { InquiryQueryRepository } from './ports/inquiry-query.repository';

@Injectable()
export class InquiriesQueryService {
  constructor(
    private readonly inquiryQueryRepository: InquiryQueryRepository,
  ) {}

  async findAllCursor(
    options: FindInquiriesCursorQuery,
    demoId: string,
  ): Promise<CursorPageDto<Inquiry>> {
    return this.inquiryQueryRepository.findAllCursor(demoId, options);
  }

  async findById(id: string, demoId: string): Promise<Inquiry> {
    const inquiry = await this.inquiryQueryRepository.findById(id, demoId);
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }
}
