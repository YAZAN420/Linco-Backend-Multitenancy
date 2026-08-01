import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindInquiryRepliesCursorQuery } from './interfaces/find-inquiryReplies.query';

import { InquiryReplyQueryRepository } from './ports/inquiryReply-query.repository';
import { InquiryReplyWithDemoMember } from 'src/core/database/prisma/types';

@Injectable()
export class InquiryRepliesQueryService {
  constructor(
    private readonly inquiryReplyQueryRepository: InquiryReplyQueryRepository,
  ) {}

  async findAllCursor(
    inquiryId: string,
    options: FindInquiryRepliesCursorQuery,
  ): Promise<CursorPageDto<InquiryReplyWithDemoMember>> {
    return this.inquiryReplyQueryRepository.findAllCursor(inquiryId, options);
  }

  async findById(id: string): Promise<InquiryReplyWithDemoMember> {
    const inquiryReply = await this.inquiryReplyQueryRepository.findById(id);
    if (!inquiryReply)
      throw new NotFoundException('errors.INQUIRY_Reply_NOT_FOUND');
    return inquiryReply;
  }
}
