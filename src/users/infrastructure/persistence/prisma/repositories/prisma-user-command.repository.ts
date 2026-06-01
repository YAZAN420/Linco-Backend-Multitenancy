import { Injectable } from '@nestjs/common';
import { UserCommandRepository } from 'src/users/application/ports/user-command.repository';
import { User } from 'src/users/domain/user';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaUserCommandRepository implements UserCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaUserMapper,
  ) {}

  async save(user: User): Promise<void> {
    const data = this.mapper.toPersistence(user);
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: data,
      create: data,
    });
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
