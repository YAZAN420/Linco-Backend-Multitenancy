import { Injectable, NotFoundException } from '@nestjs/common';
import { InquiryCommandRepository } from './ports/inquiry-command.repository';
import { InquiryFactory } from '../domain/factories/inquiry.factory';
import { Inquiry } from '../domain/inquiry';

import { CreateInquiryInput } from './interfaces/create-inquiry-input.interface';
import { UpdateInquiryInput } from './interfaces/update-inquiry-input.interface';
import { DemoCommandRepository } from 'src/demos/application/ports/demo/demo-command.repository';
import { DemoMemberCommandRepository } from 'src/demos/application/ports/demo-member/demo-member-command.repository';

@Injectable()
export class InquiriesCommandService {
  constructor(
    private readonly demoCommandRepository: DemoCommandRepository,
    private readonly inquiryCommandRepository: InquiryCommandRepository,
    private readonly demoMemberCommandRepository: DemoMemberCommandRepository,
    private readonly inquiryFactory: InquiryFactory,
  ) {}

  async create(
    input: CreateInquiryInput,
    demoId: string,
    userId: string,
  ): Promise<Inquiry> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    const demoMember = await this.demoMemberCommandRepository.findByDemoAndUser(
      demoId,
      userId,
    );
    if (!demoMember) throw new NotFoundException('DemoMemberNotFound');

    const inquiry = this.inquiryFactory.createNew(
      input.subject,
      demoMember.id,
      demoId,
    );
    await this.inquiryCommandRepository.save(inquiry);
    return inquiry;
  }

  async update(
    inquiryId: string,
    input: UpdateInquiryInput,
    demoId: string,
  ): Promise<Inquiry> {
    const inquiry = await this.findById(inquiryId, demoId);

    if (input.subject !== undefined) {
      inquiry.updateSubject(input.subject);
    }
    if (input.status !== undefined) {
      inquiry.updateStatus(input.status);
    }

    await this.inquiryCommandRepository.save(inquiry);
    return inquiry;
  }

  async remove(inquiryId: string, demoId: string): Promise<void> {
    await this.findById(inquiryId, demoId);
    await this.inquiryCommandRepository.delete(inquiryId);
  }

  async findById(inquiryId: string, demoId: string): Promise<Inquiry> {
    const demo = await this.demoCommandRepository.findById(demoId);
    if (!demo) throw new NotFoundException('Demo not found');

    const inquiry = await this.inquiryCommandRepository.findById(inquiryId);
    if (!inquiry) throw new NotFoundException('inquiry not found');
    return inquiry;
  }
}
