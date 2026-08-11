import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, User } from 'src/generated/prisma/client';
import {
  FindUsersCursorQuery,
  FindUsersQuery,
} from 'src/users/application/interfaces/find-users.query';
import { UserQueryRepository } from 'src/users/application/ports/user-query.repository';
import { UserDashboardStats } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaUserQueryRepository implements UserQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(
    currentUserId: string,
    options: FindUsersQuery | FindUsersCursorQuery,
  ): Prisma.UserWhereInput {
    const { search, createdAt } = options;
    const where: Prisma.UserWhereInput = {};

    if (createdAt) {
      where.createdAt = createdAt;
    }
    where.id = { not: currentUserId };

    if (search) {
      const searchString = search.trim();
      const parts = searchString.split(/\s+/);

      if (parts.length > 1) {
        where.firstName = { contains: parts[0], mode: 'insensitive' };
        where.lastName = {
          contains: parts[parts.length - 1],
          mode: 'insensitive',
        };
      } else {
        where.OR = [
          { firstName: { contains: searchString, mode: 'insensitive' } },
          { lastName: { contains: searchString, mode: 'insensitive' } },
        ];
      }
    }

    return where;
  }

  async findAll(
    currentUserId: string,
    options: FindUsersQuery,
  ): Promise<PageDto<User>> {
    const skip = (options.page - 1) * options.take;
    const where = this.buildWhereClause(currentUserId, options);
    const [items, itemCount] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        where,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.user.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    currentUserId: string,
    options: FindUsersCursorQuery,
  ): Promise<CursorPageDto<User>> {
    const { cursor, take } = options;
    const where = this.buildWhereClause(currentUserId, options);
    const items = await this.prisma.user.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      where,
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

  async getUserDashboardStats(): Promise<UserDashboardStats> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalUsers, verifiedAccounts, newThisMonth, twoFactorEnabled] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.user.count({ where: { isEmailVerified: true } }),
        this.prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
        this.prisma.user.count({ where: { isTwoFactorEnabled: true } }),
      ]);

    return {
      totalUsers,
      verifiedAccounts,
      newThisMonth,
      twoFactorEnabled,
    };
  }
}
