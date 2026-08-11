import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserCommandRepository } from 'src/users/application/ports/user-command.repository';
import { User } from 'src/users/domain/user';
import { PrismaUserMapper } from '../mappers/prisma-user.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaUserCommandRepository implements UserCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaUserMapper,
  ) {}

  async save(user: User): Promise<void> {
    const data = this.mapper.toPersistence(user);
    try {
      await this.prisma.user.upsert({
        where: { id: user.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('errors.USER_NOT_FOUND');
        }
      }
      throw new InternalServerErrorException(
        'errors.DATABASE_OPERATION_FAILED_ERROR',
      );
    }
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
