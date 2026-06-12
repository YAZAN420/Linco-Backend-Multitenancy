import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { SectionCommandRepository } from 'src/courses/application/ports/section-command.repository';
import { PrismaSectionMapper } from '../mappers/prisma-section.mapper';
import { Section } from 'src/courses/domain/section';

@Injectable()
export class PrismaSectionCommandRepository implements SectionCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaSectionMapper,
  ) {}

  async save(section: Section): Promise<void> {
    const data = this.mapper.toPersistence(section);
    await this.prisma.section.upsert({
      where: { id: section.id },
      update: data,
      create: data,
    });
  }

  async delete(sectionId: string): Promise<void> {
    await this.prisma.section.delete({
      where: { id: sectionId },
    });
  }

  async findById(sectionId: string): Promise<Section | null> {
    const section = await this.prisma.section.findFirst({
      where: { id: sectionId },
    });
    return section ? this.mapper.toDomain(section) : null;
  }
}
