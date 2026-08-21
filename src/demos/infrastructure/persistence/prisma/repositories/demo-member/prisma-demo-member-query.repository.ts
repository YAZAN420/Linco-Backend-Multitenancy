import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { DemoMemberWithUser } from 'src/core/database/prisma/types';
import { DemoMember, Prisma } from 'src/generated/prisma/client';
import { DemoMemberQueryRepository } from 'src/demos/application/ports/demo-member/demo-member-query.repository';
import { FindDemoMembersCursorQuery } from 'src/demos/application/demo-member/interfaces/find-demo-members.query';

@Injectable()
export class PrismaDemoMemberQueryRepository implements DemoMemberQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Prisma.DemoMemberWhereInput {
    const { search, createdAt } = options;
    const where: Prisma.DemoMemberWhereInput = {
      demoId,
    };
    if (createdAt) {
      where.joinedAt = createdAt;
    }
    if (search) {
      const searchString = search.trim();
      const parts = searchString.split(/\s+/);

      if (parts.length > 1) {
        where.user = {
          firstName: { contains: parts[0], mode: 'insensitive' },
          lastName: { contains: parts[parts.length - 1], mode: 'insensitive' },
        };
      } else {
        where.user = {
          OR: [
            { firstName: { contains: searchString, mode: 'insensitive' } },
            { lastName: { contains: searchString, mode: 'insensitive' } },
          ],
        };
      }
    }
    return where;
  }

  async findAllByDemo(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Promise<CursorPageDto<DemoMemberWithUser>> {
    const { cursor, take } = options;
    const where = this.buildWhereClause(demoId, options);
    const items = await this.prisma.demoMember.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy: [{ joinedAt: 'desc' }, { id: 'desc' }],
      include: {
        user: true,
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

  async findById(memberId: string): Promise<DemoMemberWithUser | null> {
    return this.prisma.demoMember.findFirst({
      where: { id: memberId },
      include: {
        user: true,
      },
    });
  }

  async findDemoMemberByUserId(
    demoId: string,
    userId: string,
  ): Promise<DemoMember | null> {
    return this.prisma.demoMember.findFirst({
      where: { demoId: demoId, userId: userId },
    });
  }

  async countMembersByDemo(demoId: string): Promise<number> {
    return this.prisma.demoMember.count({
      where: { demoId },
    });
  }
}
