import { Module } from '@nestjs/common';
import { UserCommandRepository } from 'src/users/application/ports/user-command.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaUserMapper } from './mappers/prisma-user.mapper';
import { UserQueryRepository } from 'src/users/application/ports/user-query.repository.interface';
import { PrismaUserQueryRepository } from './repositories/prisma-user-query.repository';

@Module({
  providers: [
    PrismaUserMapper,
    {
      provide: UserCommandRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: UserQueryRepository,
      useClass: PrismaUserQueryRepository,
    },
  ],
  exports: [UserCommandRepository, UserQueryRepository],
})
export class PrismaPersistenceModule {}
