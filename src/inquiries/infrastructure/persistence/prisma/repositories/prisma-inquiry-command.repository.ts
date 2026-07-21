import { Injectable } from '@nestjs/common';
import { InquiryCommandRepository } from 'src/inquiries/application/ports/inquiry-command.repository';
import { Inquiry } from 'src/inquiries/domain/inquiry';
import { PrismaInquiryMapper } from '../mappers/prisma-inquiry.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaInquiryCommandRepository implements InquiryCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaInquiryMapper,
  ) {}

  async save(inquiry: Inquiry): Promise<void> {
    const data = this.mapper.toPersistence(inquiry);
    await this.prisma.inquiry.upsert({
      where: { id: inquiry.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.inquiry.delete({ where: { id } });
  }

  async findById(id: string, demoId: string): Promise<Inquiry | null> {
    const inquiry = await this.prisma.inquiry.findFirst({
      where: { id, demoId },
    });
    return inquiry ? this.mapper.toDomain(inquiry) : null;
  }
}
