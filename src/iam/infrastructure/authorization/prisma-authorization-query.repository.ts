import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import {
  DemoMemberRole,
  DepartmentMemberRole,
} from 'src/generated/prisma/client';
import { AuthorizationQueryRepository } from '../../application/ports/authorization-query.repository';

@Injectable()
export class PrismaAuthorizationQueryRepository implements AuthorizationQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDemoRole(
    userId: string,
    demoId: string,
  ): Promise<DemoMemberRole | null> {
    const member = await this.prisma.demoMember.findUnique({
      where: {
        userId_demoId: {
          userId,
          demoId,
        },
      },
      select: {
        role: true,
      },
    });
    return member?.role ?? null;
  }

  async findDepartmentRole(
    userId: string,
    demoId: string,
    departmentId: string,
  ): Promise<DepartmentMemberRole | null> {
    const member = await this.prisma.departmentMember.findFirst({
      where: {
        departmentId,
        demoMember: {
          userId,
          demoId,
        },
      },
      select: {
        role: true,
      },
    });
    return member?.role ?? null;
  }
}
