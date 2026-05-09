import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { User } from 'src/users/domain/user';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import {
  CursorPageDto,
  CursorPageMetaDto,
  CursorPageOptionsDto,
  PageDto,
  PageMetaDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaUserMapper,
  ) {}

  async findAll(options: PageOptionsDto): Promise<PageDto<User>> {
    const [items, itemCount] = await Promise.all([
      this.prisma.user.findMany({
        skip: options.skip,
        take: options.take,
      }),
      this.prisma.user.count(),
    ]);

    const domainUsers = items.map((item) => this.mapper.toDomain(item));
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: options });

    return new PageDto(domainUsers, pageMetaDto);
  }

  async findAllCursor(
    options: CursorPageOptionsDto,
  ): Promise<CursorPageDto<User>> {
    const { cursor, take } = options;
    const items = await this.prisma.user.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
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
      where: { id: user.getId() },
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

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
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
