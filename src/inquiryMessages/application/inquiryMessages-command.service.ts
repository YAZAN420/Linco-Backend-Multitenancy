import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryMessageCommandRepository } from './ports/inquiryMessage-command.repository';
import { InquiryMessageFactory } from '../domain/factories/inquiryMessage.factory';
import { InquiryMessage } from '../domain/inquiryMessage';

import { CreateInquiryMessageInput } from './interfaces/create-inquiryMessage-input.interface';
import { UpdateInquiryMessageInput } from './interfaces/update-inquiryMessage-input.interface';

import { InquiryCommandRepository } from 'src/inquiries/application/ports/inquiry-command.repository';

@Injectable()
export class InquiryMessagesCommandService {
  constructor(
    private readonly inquiryMessageCommandRepository: InquiryMessageCommandRepository,
    private readonly inquiryMessageFactory: InquiryMessageFactory,
    private readonly inquiryCommandRepository: InquiryCommandRepository,
  ) {}

  async create(
    inquiryId: string,
    userId: string,
    input: CreateInquiryMessageInput,
  ): Promise<InquiryMessage> {
    const inquiry = await this.inquiryCommandRepository.findById(inquiryId);
    if (!inquiry) throw new NotFoundException('Inquiry Not Found');

    const inquiryMessage = this.inquiryMessageFactory.createNew(
      userId,
      inquiryId,
      input.message,
    );
    await this.inquiryMessageCommandRepository.save(inquiryMessage);
    return inquiryMessage;
  }

  async update(
    inquiryId: string,
    inquiryMessageId: string,
    input: UpdateInquiryMessageInput,
  ): Promise<InquiryMessage> {
    const inquiry = await this.inquiryCommandRepository.findById(inquiryId);
    if (!inquiry) throw new NotFoundException('Inquiry Not Found');

    const inquiryMessage = await this.findById(inquiryMessageId);

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
