import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import { FindDepartmentMessagesCursorQuery } from 'src/departmentMessages/application/interfaces/find-departmentMessages.query';
import { DepartmentMessageQueryRepository } from 'src/departmentMessages/application/ports/departmentMessage-query.repository';
import { DepartmentMessageWithSenderAndReply } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaDepartmentMessageQueryRepository implements DepartmentMessageQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    departmentId: string,
    options: FindDepartmentMessagesCursorQuery,
  ): Promise<CursorPageDto<DepartmentMessageWithSenderAndReply>> {
    const { cursor, take } = options;

    const items = await this.prisma.departmentMessage.findMany({
      where: { departmentId },
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      include: {
        sender: {
          select: {
            id: true,
            demoMember: {
              select: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    imagePath: true,
                  },
                },
              },
            },
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            type: true,
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
    id: string,
  ): Promise<DepartmentMessageWithSenderAndReply | null> {
    return this.prisma.departmentMessage.findUnique({
      where: { id },
      include: {
        sender: {
          select: {
            id: true,
            demoMember: {
              select: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    imagePath: true,
                  },
                },
              },
            },
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            type: true,
          },
        },
      },
    });
  }
}
