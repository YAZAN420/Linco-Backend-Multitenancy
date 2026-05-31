import { Module } from '@nestjs/common';
import { UserCommandRepository } from 'src/users/application/ports/user-command.repository';
import { PrismaUserCommandRepository } from './repositories/prisma-user-command.repository';
import { PrismaUserMapper } from './mappers/prisma-user.mapper';
import { UserQueryRepository } from 'src/users/application/ports/user-query.repository';
import { PrismaUserQueryRepository } from './repositories/prisma-user-query.repository';

@Module({
  providers: [
    PrismaUserMapper,
    {
      provide: UserCommandRepository,
      useClass: PrismaUserCommandRepository,
    },
    {
      provide: UserQueryRepository,
      useClass: PrismaUserQueryRepository,
    },
  ],
  exports: [UserCommandRepository, UserQueryRepository],
})
export class PrismaPersistenceModule {}
