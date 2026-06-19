import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { DemoMemberQueryRepository } from 'src/demos/application/ports/demo-member-query.repository';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { FindDemoMembersCursorQuery } from 'src/demos/application/interfaces/find-demos.query';
import { DemoMemberWithUser } from 'src/core/database/prisma/types';
import { DemoMember } from 'src/generated/prisma/client';

@Injectable()
export class PrismaDemoMemberQueryRepository implements DemoMemberQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByDemo(
    demoId: string,
    options: FindDemoMembersCursorQuery,
  ): Promise<CursorPageDto<DemoMemberWithUser>> {
    const { cursor, take } = options;

    const items = await this.prisma.demoMember.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: { demoId },
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

  async findById(
    demoId: string,
    memberId: string,
  ): Promise<DemoMemberWithUser | null> {
    return this.prisma.demoMember.findFirst({
      where: { id: memberId, demoId },
      include: {
        user: true,
      },
    });
  }

  async findDemoMemberByUserId(userId: string): Promise<DemoMember | null> {
    return this.prisma.demoMember.findFirst({
      where: { userId: userId },
    });
  }
}
