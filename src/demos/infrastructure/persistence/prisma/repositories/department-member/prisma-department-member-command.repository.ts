import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { DepartmentMemberCommandRepository } from 'src/demos/application/ports/department-member/department-member-command.repository';
import { PrismaDepartmentMemberMapper } from '../../mappers/prisma-department-member.mapper';
import { DepartmentMember } from 'src/demos/domain/department-member';

@Injectable()
export class PrismaDepartmentMemberCommandRepository implements DepartmentMemberCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDepartmentMemberMapper,
  ) {}

  async save(member: DepartmentMember): Promise<void> {
    const data = this.mapper.toPersistence(member);
    await this.prisma.departmentMember.upsert({
      where: {
        id: member.id,
      },
      update: data,
      create: data,
    });
  }

  async findById(id: string): Promise<DepartmentMember | null> {
    const member = await this.prisma.departmentMember.findUnique({
      where: { id },
    });
    return member ? this.mapper.toDomain(member) : null;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.departmentMember.delete({
      where: { id },
    });
  }

  async findByDepartmentAndDemoMember(
    departmentId: string,
    demoMemberId: string,
  ): Promise<DepartmentMember | null> {
    const member = await this.prisma.departmentMember.findUnique({
      where: {
        departmentId_demoMemberId: {
          departmentId,
          demoMemberId,
        },
      },
    });
    return member ? this.mapper.toDomain(member) : null;
  }

  async countByDepartment(departmentId: string): Promise<number> {
    return this.prisma.departmentMember.count({ where: { departmentId } });
  }
}
