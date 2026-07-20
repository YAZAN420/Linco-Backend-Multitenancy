import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindInquiriesCursorQuery } from './interfaces/find-inquiries.query';
import { Inquiry } from 'src/generated/prisma/client';
import { InquiryQueryRepository } from './ports/inquiry-query.repository';
import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';

@Injectable()
export class InquiriesQueryService {
  constructor(
    private readonly inquiryQueryRepository: InquiryQueryRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
  ) {}

  async findAllCursor(
    options: FindInquiriesCursorQuery,
    demoId: string,
  ): Promise<CursorPageDto<Inquiry>> {
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException(`Demo with ID ${demoId} not found`);
    }
    return this.inquiryQueryRepository.findAllCursor(demo.id, options);
  }

  async findById(id: string, demoId: string): Promise<Inquiry> {
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException(`Demo with ID ${demoId} not found`);
    }
    const inquiry = await this.inquiryQueryRepository.findById(id);
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }
}
