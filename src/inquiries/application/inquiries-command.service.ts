import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryCommandRepository } from './ports/inquiry-command.repository';
import { InquiryFactory } from '../domain/factories/inquiry.factory';
import { Inquiry } from '../domain/inquiry';

import { CreateInquiryInput } from './interfaces/create-inquiry-input.interface';
import { UpdateInquiryInput } from './interfaces/update-inquiry-input.interface';

@Injectable()
export class InquiriesCommandService {
  constructor(
    private readonly inquiryCommandRepository: InquiryCommandRepository,
    private readonly inquiryFactory: InquiryFactory,
  ) {}

  async create(
    input: CreateInquiryInput,
    demoId: string,
    demoMemberId: string,
  ): Promise<Inquiry> {
    const inquiry = this.inquiryFactory.createNew(
      input.subject,
      input.message,
      demoMemberId,
      demoId,
    );
    await this.inquiryCommandRepository.save(inquiry);

    return inquiry;
  }

  async update(
    demoId: string,
    inquiryId: string,
    input: UpdateInquiryInput,
  ): Promise<Inquiry> {
    const inquiry = await this.findById(inquiryId, demoId);

    if (input.subject !== undefined) {
      inquiry.updateSubject(input.subject);
    }
    if (input.message !== undefined) {
      inquiry.updateMessage(input.message);
    }
    if (input.status !== undefined) {
      inquiry.updateStatus(input.status);
    }

    await this.inquiryCommandRepository.save(inquiry);
    return inquiry;
  }

  async remove(demoId: string, inquiryId: string): Promise<void> {
    await this.findById(inquiryId, demoId);
    await this.inquiryCommandRepository.delete(inquiryId);
  }

  async findById(inquiryId: string, demoId: string): Promise<Inquiry> {
    const inquiry = await this.inquiryCommandRepository.findById(
      inquiryId,
      demoId,
    );
    if (!inquiry) throw new NotFoundException('errors.INQUIRY_NOT_FOUND');
    return inquiry;
  }
}
