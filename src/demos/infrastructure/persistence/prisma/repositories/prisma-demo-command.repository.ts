import { Injectable } from '@nestjs/common';
import { DemoCommandRepository } from 'src/demos/application/ports/demo-command.repository';
import { Demo } from 'src/demos/domain/demo';
import { PrismaDemoMapper } from '../mappers/prisma-demo.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaDemoCommandRepository implements DemoCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDemoMapper,
  ) {}

  async save(demo: Demo): Promise<void> {
    const data = this.mapper.toPersistence(demo);
    await this.prisma.demo.upsert({
      where: { id: demo.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.demo.delete({ where: { id } });
  }

  async findById(id: string): Promise<Demo | null> {
    const demo = await this.prisma.demo.findUnique({
      where: { id },
      include: { departments: true },
    });
    return demo ? this.mapper.toDomain(demo) : null;
  }
}
