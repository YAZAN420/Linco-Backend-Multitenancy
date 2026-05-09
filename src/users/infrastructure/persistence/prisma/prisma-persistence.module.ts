import { Module } from '@nestjs/common';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { PrismaUserMapper } from './mappers/prisma-user.mapper';

@Module({
  providers: [
    PrismaUserMapper,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class PrismaPersistenceModule {}
