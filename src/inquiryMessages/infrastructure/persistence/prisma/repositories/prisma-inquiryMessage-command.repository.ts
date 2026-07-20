import { Injectable } from '@nestjs/common';
import { InquiryMessageCommandRepository } from 'src/inquiryMessages/application/ports/inquiryMessage-command.repository';
import { InquiryMessage } from 'src/inquiryMessages/domain/inquiryMessage';
import { PrismaInquiryMessageMapper } from '../mappers/prisma-inquiryMessage.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaInquiryMessageCommandRepository implements InquiryMessageCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaInquiryMessageMapper,
  ) {}

  async save(inquiryMessage: InquiryMessage): Promise<void> {
    const data = this.mapper.toPersistence(inquiryMessage);
    await this.prisma.inquiryMessage.upsert({
      where: { id: inquiryMessage.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.inquiryMessage.delete({ where: { id } });
  }

  async findById(id: string): Promise<InquiryMessage | null> {
    const inquiryMessage = await this.prisma.inquiryMessage.findUnique({
      where: { id },
    });
    return inquiryMessage ? this.mapper.toDomain(inquiryMessage) : null;
  }
}
