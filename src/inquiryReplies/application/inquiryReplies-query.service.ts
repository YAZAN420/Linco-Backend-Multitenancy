import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindInquiryRepliesCursorQuery,
  FindInquiryRepliesQuery,
} from './interfaces/find-inquiryReplies.query';
import { InquiryReply } from 'src/generated/prisma/client';
import { InquiryReplyQueryRepository } from './ports/inquiryReply-query.repository';

@Injectable()
export class InquiryRepliesQueryService {
  constructor(private readonly inquiryReplyQueryRepository: InquiryReplyQueryRepository) {}

  async findAllCursor(
    inquiryId: string,
    options: FindInquiryRepliesCursorQuery,
  ): Promise<CursorPageDto<InquiryReply>> {
    return this.inquiryReplyQueryRepository.findAllCursor(inquiryId, options);
  }

  async findById(id: string): Promise<InquiryReply> {
    const inquiryReply =
      await this.inquiryReplyQueryRepository.findById(id);
    if (!inquiryReply)
      throw new NotFoundException('errors.INQUIRY_Reply_NOT_FOUND');
    return inquiryReply;
  }
}
