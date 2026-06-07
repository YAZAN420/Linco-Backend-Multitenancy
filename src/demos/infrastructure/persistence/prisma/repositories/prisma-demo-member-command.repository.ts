import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { DemoMemberCommandRepository } from 'src/demos/application/ports/demo-member-command.repository';
import { DemoMember } from 'src/demos/domain/demo-member';
import { PrismaDemoMemberMapper } from '../mappers/prisma-demo-member.mapper';

@Injectable()
export class PrismaDemoMemberCommandRepository implements DemoMemberCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDemoMemberMapper,
  ) {}

  async save(member: DemoMember): Promise<void> {
    const data = this.mapper.toPersistence(member);
    await this.prisma.demoMember.upsert({
      where: {
        id: member.id,
      },
      update: { role: data.role },
      create: data,
    });
  }

  async findById(id: string): Promise<DemoMember | null> {
    const member = await this.prisma.demoMember.findUnique({
      where: { id },
    });
    return member ? this.mapper.toDomain(member) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.demoMember.delete({
      where: { id },
    });
  }

  async findByDemoAndUser(
    demoId: string,
    userId: string,
  ): Promise<DemoMember | null> {
    const member = await this.prisma.demoMember.findUnique({
      where: { userId_demoId: { demoId, userId } },
    });
    return member ? this.mapper.toDomain(member) : null;
  }

  async countByDemo(demoId: string): Promise<number> {
    return this.prisma.demoMember.count({ where: { demoId } });
  }
}
