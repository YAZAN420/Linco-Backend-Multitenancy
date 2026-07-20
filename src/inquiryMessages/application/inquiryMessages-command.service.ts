import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryMessageCommandRepository } from './ports/inquiryMessage-command.repository';
import { InquiryMessageFactory } from '../domain/factories/inquiryMessage.factory';
import { InquiryMessage } from '../domain/inquiryMessage';

import { CreateInquiryMessageInput } from './interfaces/create-inquiryMessage-input.interface';
import { UpdateInquiryMessageInput } from './interfaces/update-inquiryMessage-input.interface';

@Injectable()
export class InquiryMessagesCommandService {
  constructor(
    private readonly inquiryMessageCommandRepository: InquiryMessageCommandRepository,
    private readonly inquiryMessageFactory: InquiryMessageFactory,
  ) {}

  async create(input: CreateInquiryMessageInput): Promise<InquiryMessage> {
    const inquiryMessage = this.inquiryMessageFactory.createNew(
      input.senderId,
      input.inquiryId,
      input.message,
    );
    await this.inquiryMessageCommandRepository.save(inquiryMessage);
    return inquiryMessage;
  }

  async update(
    inquiryMessageId: string,
    input: UpdateInquiryMessageInput,
  ): Promise<InquiryMessage> {
    console.log(input);
    const inquiryMessage = await this.findById(inquiryMessageId);

    if (input.inquiryId != undefined) {
      inquiryMessage.updateInquiryId(input.inquiryId);
    }

    if (input.senderId != undefined) {
      inquiryMessage.updateSenderId(input.senderId);
    }

    if (input.message != undefined) {
      inquiryMessage.updateMessage(input.message);
    }

    await this.inquiryMessageCommandRepository.save(inquiryMessage);
    return inquiryMessage;
  }

  async remove(inquiryMessageId: string): Promise<void> {
    await this.findById(inquiryMessageId);
    await this.inquiryMessageCommandRepository.delete(inquiryMessageId);
  }

  async findById(inquiryMessageId: string): Promise<InquiryMessage> {
    const inquiryMessage =
      await this.inquiryMessageCommandRepository.findById(inquiryMessageId);
    if (!inquiryMessage)
      throw new NotFoundException('inquiryMessage not found');
    return inquiryMessage;
  }
}
