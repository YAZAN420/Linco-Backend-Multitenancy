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

  async create(
    inquiryId: string,
    demoMemberId: string,
    input: CreateInquiryMessageInput,
  ): Promise<InquiryMessage> {
    const inquiryMessage = this.inquiryMessageFactory.createNew(
      demoMemberId,
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
      throw new NotFoundException('errors.INQUIRY_MESSAGE_NOT_FOUND');
    return inquiryMessage;
  }
}
