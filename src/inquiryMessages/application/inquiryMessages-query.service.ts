import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindInquiryMessagesCursorQuery,
  FindInquiryMessagesQuery,
} from './interfaces/find-inquiryMessages.query';
import { InquiryMessage } from 'src/generated/prisma/client';
import { InquiryMessageQueryRepository } from './ports/inquiryMessage-query.repository';

@Injectable()
export class InquiryMessagesQueryService {
  constructor(private readonly inquiryMessageQueryRepository: InquiryMessageQueryRepository) {}

  async findAll(pageOptionsDto: FindInquiryMessagesQuery): Promise<PageDto<InquiryMessage>> {
    return this.inquiryMessageQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: FindInquiryMessagesCursorQuery,
  ): Promise<CursorPageDto<InquiryMessage>> {
    return this.inquiryMessageQueryRepository.findAllCursor(options);
  }

  async findById(id: string): Promise<InquiryMessage> {
    const inquiryMessage = await this.inquiryMessageQueryRepository.findById(id);
    if (!inquiryMessage) throw new NotFoundException('InquiryMessage not found');
    return inquiryMessage;
  }
}
