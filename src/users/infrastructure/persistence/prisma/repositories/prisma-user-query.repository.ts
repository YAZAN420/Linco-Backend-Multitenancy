import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/browser';
import { User } from 'src/generated/prisma/browser';
import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from 'src/users/application/interfaces/find-users.query';

import { UserQueryRepository } from 'src/users/application/ports/user-query.repository.interface';
const USER_SEARCH_COLUMNS = ['firstName', 'lastName', 'email'];
const USER_ORDERABLE_FIELDS = ['createdAt', 'firstName', 'lastName', 'email'];

@Injectable()
export class PrismaUserQueryRepository implements UserQueryRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(options: FindUsersQuery): Promise<PageDto<User>> {
    const where = buildWhere<FindUsersQuery, Prisma.UserWhereInput>(
      options,
      USER_SEARCH_COLUMNS,
    );
    const orderBy = buildOrderBy(options.orderBy, USER_ORDERABLE_FIELDS);
    const skip = (options.page - 1) * options.take;
    const [items, itemCount] = await Promise.all([
      this.prisma.user.findMany({
        skip: skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.user.count({ where }),
    ]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: options });

    return new PageDto(items, pageMetaDto);
  }

  async findAllCursor(
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>> {
    const where = buildWhere<FindUsersCursorQuery, Prisma.UserWhereInput>(
      options,
      USER_SEARCH_COLUMNS,
    );
    const orderBy = buildOrderBy(options.orderBy, USER_ORDERABLE_FIELDS);
    const { cursor, take } = options;
    const items = await this.prisma.user.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy: orderBy.length > 0 ? orderBy : [{ id: 'desc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;
    const meta = new CursorPageMetaDto(hasNextPage, endCursor);

    return new CursorPageDto(items, meta);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }
}
