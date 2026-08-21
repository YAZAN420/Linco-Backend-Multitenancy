import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { DemoMemberCommandRepository } from 'src/demos/application/ports/demo-member/demo-member-command.repository';
import { DemoMember } from 'src/demos/domain/demo-member';
import { PrismaDemoMemberMapper } from '../../mappers/prisma-demo-member.mapper';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaDemoMemberCommandRepository implements DemoMemberCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDemoMemberMapper,
  ) {}

  async save(member: DemoMember): Promise<void> {
    const data = this.mapper.toPersistence(member);
    try {
      await this.prisma.demoMember.upsert({
        where: {
          id: member.id,
        },
        update: data,
        create: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('errors.DEMO_MEMBER_NOT_FOUND');
        }
      }
      throw new InternalServerErrorException({
        message: 'errors.DATABASE_OPERATION_FAILED_ERROR',
        args: { error: String(error) },
      });
    }
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
