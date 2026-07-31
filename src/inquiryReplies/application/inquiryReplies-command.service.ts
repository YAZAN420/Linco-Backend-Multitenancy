import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryReplyCommandRepository } from './ports/inquiryReply-command.repository';
import { InquiryReplyFactory } from '../domain/factories/inquiryReply.factory';
import { InquiryReply } from '../domain/inquiryReply';

import { CreateInquiryReplyInput } from './interfaces/create-inquiryReply-input.interface';
import { UpdateInquiryReplyInput } from './interfaces/update-inquiryReply-input.interface';
import { InquirySenderType } from '../domain/enums/InquirySenderType';

@Injectable()
export class InquiryRepliesCommandService {
  constructor(
    private readonly inquiryReplyCommandRepository: InquiryReplyCommandRepository,
    private readonly inquiryReplyFactory: InquiryReplyFactory,
  ) {}

  async create(
    inquiryId: string,
    demoMemberId: string,
    input: CreateInquiryReplyInput
  ): Promise<InquiryReply> {
    const inquiryReply = this.inquiryReplyFactory.createNew(
      input.message,
      InquirySenderType.ADMIN,
      demoMemberId,
      inquiryId
    );
    await this.inquiryReplyCommandRepository.save(inquiryReply);
    return inquiryReply;
  }

  async update(
    inquiryId: string,
    inquiryReplyId: string, 
    input: UpdateInquiryReplyInput): Promise<InquiryReply> {
    
      console.log(input);
    const inquiryReply = await this.findById(inquiryReplyId);

    if(input.message != undefined) {
      inquiryReply.updateMessage(input.message);
    }

    await this.inquiryReplyCommandRepository.save(inquiryReply);
    return inquiryReply;
  }

  async remove(inquiryReplyId: string): Promise<void> {
    await this.findById(inquiryReplyId);
    await this.inquiryReplyCommandRepository.delete(inquiryReplyId);
  }

  async findById(inquiryReplyId: string): Promise<InquiryReply> {
    const inquiryReply = await this.inquiryReplyCommandRepository.findById(inquiryReplyId);
    if (!inquiryReply) 
      throw new NotFoundException('errors.INQUIRY_REPLY_NOT_FOUND');
    return inquiryReply;
  }
}
