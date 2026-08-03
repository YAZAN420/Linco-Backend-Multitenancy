import { Injectable } from '@nestjs/common';
import { InquiryReplyCommandRepository } from 'src/inquiryReplies/application/ports/inquiryReply-command.repository';
import { InquiryReply } from 'src/inquiryReplies/domain/inquiryReply';
import { PrismaInquiryReplyMapper } from '../mappers/prisma-inquiryReply.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaInquiryReplyCommandRepository implements InquiryReplyCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaInquiryReplyMapper,
  ) {}

  async save(inquiryReply: InquiryReply): Promise<void> {
    const data = this.mapper.toPersistence(inquiryReply);
    await this.prisma.inquiryReply.upsert({
      where: { id: inquiryReply.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.inquiryReply.delete({ where: { id } });
  }

  async findById(id: string): Promise<InquiryReply | null> {
    const inquiryReply = await this.prisma.inquiryReply.findUnique({
      where: { id },
    });
    return inquiryReply ? this.mapper.toDomain(inquiryReply) : null;
  }
}
