import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { InvitationStatus } from 'src/generated/prisma/client';

import { InvitationQueryRepository } from 'src/demos/application/ports/invitation/invitation-query.repository';
import { FindCursorQuery } from 'src/common/interfaces/find.query';
import { InvitationWithUserAndDemo } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaInvitationQueryRepository implements InvitationQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    receiverId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<InvitationWithUserAndDemo>> {
    const { cursor, take } = options;

    const items = await this.prisma.invitation.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      where: {
        receiverId,
        status: InvitationStatus.PENDING,
      },
      include: {
        sender: true,
        demo: true,
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

  async findById(id: string): Promise<InvitationWithUserAndDemo | null> {
    return this.prisma.invitation.findUnique({
      where: { id },
      include: {
        sender: true,
        demo: true,
      },
    });
  }
}
