import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { User } from 'src/generated/prisma/client';
import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from 'src/users/application/interfaces/find-users.query';
import { UserQueryRepository } from 'src/users/application/ports/user-query.repository';

@Injectable()
export class PrismaUserQueryRepository implements UserQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: FindUsersQuery): Promise<PageDto<User>> {
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.user.count(),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>> {
    const { cursor, take } = options;

    const items = await this.prisma.user.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}
