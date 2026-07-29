import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { FindCursorQuery } from 'src/common/interfaces/find.query';
import { DepartmentMemberQueryRepository } from 'src/demos/application/ports/department-member/department-member-query.repository';
import { DepartmentMemberWithUser } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaDepartmentMemberQueryRepository implements DepartmentMemberQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByDepartment(
    departmentId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<DepartmentMemberWithUser>> {
    const { cursor, take } = options;

    const items = await this.prisma.departmentMember.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: { departmentId },
      orderBy: [{ assignedAt: 'desc' }, { id: 'desc' }],
      include: {
        demoMember: {
          include: {
            user: true,
          },
        },
      },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(
    departmentId: string,
    demoMemberId: string,
  ): Promise<DepartmentMemberWithUser | null> {
    return this.prisma.departmentMember.findFirst({
      where: { demoMemberId, departmentId },
      include: {
        demoMember: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findByUserId(
    departmentId: string,
    userId: string,
  ): Promise<DepartmentMemberWithUser | null> {
    return this.prisma.departmentMember.findFirst({
      where: { departmentId, demoMember: { userId } },
      include: {
        demoMember: {
          include: {
            user: true,
          },
        },
      },
    });
  }
}
