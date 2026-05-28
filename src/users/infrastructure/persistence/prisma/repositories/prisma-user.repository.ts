import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { User } from 'src/users/domain/user';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import {
  CursorPageDto,
  CursorPageMetaDto,
  PageDto,
  PageMetaDto,
} from 'src/common/dtos/pagination';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { FindUsersDto } from 'src/users/presentation/http/dto/filters/find-users.dto';
import { FindUsersCursorDto } from 'src/users/presentation/http/dto/filters/find-users-cursor.dto';
import { buildWhere } from 'src/common/utils/prisma.util';
import { Prisma } from 'src/generated/prisma/browser';

const USER_SEARCH_COLUMNS = ['firstName', 'lastName', 'email'];

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaUserMapper,
  ) {}

  async findAll(options: FindUsersDto): Promise<PageDto<User>> {
    const where = buildWhere<FindUsersDto, Prisma.UserWhereInput>(
      options,
      USER_SEARCH_COLUMNS,
    );
    const [items, itemCount] = await Promise.all([
      this.prisma.user.findMany({
        skip: options.skip,
        take: options.take,
        where,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    const domainUsers = items.map((item) => this.mapper.toDomain(item));
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: options });

    return new PageDto(domainUsers, pageMetaDto);
  }

  async findAllCursor(
    options: FindUsersCursorDto,
  ): Promise<CursorPageDto<User>> {
    const where = buildWhere<FindUsersCursorDto, Prisma.UserWhereInput>(
      options,
      USER_SEARCH_COLUMNS,
    );
    const { cursor, take } = options;
    const items = await this.prisma.user.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy: { id: 'desc' },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const domainUsers = items.map((item) => this.mapper.toDomain(item));
    const endCursor = items.length > 0 ? items[items.length - 1].id : null;
    const meta = new CursorPageMetaDto(hasNextPage, endCursor);

    return new CursorPageDto(domainUsers, meta);
  }

  async save(user: User): Promise<void> {
    const data = this.mapper.toPersistence(user);
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.mapper.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.mapper.toDomain(user) : null;
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });
    return user ? this.mapper.toDomain(user) : null;
  }

  async findByResetToken(token: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { passwordResetToken: token },
    });
    return user ? this.mapper.toDomain(user) : null;
  }
}
