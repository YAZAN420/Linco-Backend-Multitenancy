import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { WithRealtionsDto } from 'src/common/dtos/with-realtions.dto';
import {
  buildNestedInclude,
  buildOrderBy,
  buildWhere,
} from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, User } from 'src/generated/prisma/browser';
import { UserInclude } from 'src/generated/prisma/internal/prismaNamespaceBrowser';
import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from 'src/users/application/interfaces/find-users.query';
import { UserQueryRepository } from 'src/users/application/ports/user-query.repository';

const USER_SEARCH_COLUMNS = ['firstName', 'lastName', 'email'];
const USER_ORDERABLE_FIELDS = ['createdAt', 'firstName', 'lastName', 'email'];
type UserRelation = keyof Prisma.UserInclude;

@Injectable()
export class PrismaUserQueryRepository implements UserQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly allowedRelations: UserRelation[] = [];

  private buildPrismaArgs<T extends FindUsersQuery | FindUsersCursorQuery>(
    options: T,
  ) {
    return {
      where: buildWhere<T, Prisma.UserWhereInput>(options, USER_SEARCH_COLUMNS),
      orderBy: buildOrderBy(options.orderBy, USER_ORDERABLE_FIELDS),
      include: buildNestedInclude<UserInclude>(
        options.with,
        this.allowedRelations,
      ),
    };
  }

  async findAll(options: FindUsersQuery): Promise<PageDto<User>> {
    const { where, orderBy, include } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: options.take,
        where,
        include,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.user.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>> {
    const { where, orderBy, include } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.user.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      include,
      orderBy: orderBy.length > 0 ? orderBy : [{ id: 'desc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string, options?: WithRealtionsDto): Promise<User | null> {
    const include = buildNestedInclude<UserInclude>(
      options?.with,
      this.allowedRelations,
    );

    return this.prisma.user.findUnique({
      where: { id },
      include,
    });
  }
}
