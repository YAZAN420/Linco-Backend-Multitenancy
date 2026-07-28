import { Injectable } from '@nestjs/common';
import { DepartmentMessageCommandRepository } from 'src/departmentMessages/application/ports/departmentMessage-command.repository';
import { DepartmentMessage } from 'src/departmentMessages/domain/departmentMessage';
import { PrismaDepartmentMessageMapper } from '../mappers/prisma-departmentMessage.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaDepartmentMessageCommandRepository implements DepartmentMessageCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDepartmentMessageMapper,
  ) {}

  async save(departmentMessage: DepartmentMessage): Promise<void> {
    const data = this.mapper.toPersistence(departmentMessage);
    await this.prisma.departmentMessage.upsert({
      where: { id: departmentMessage.id },
      update: data,
      create: data,
    });
  }

  async findById(id: string): Promise<DepartmentMessage | null> {
    const departmentMessage = await this.prisma.departmentMessage.findUnique({
      where: { id },
    });
    return departmentMessage ? this.mapper.toDomain(departmentMessage) : null;
  }
}
