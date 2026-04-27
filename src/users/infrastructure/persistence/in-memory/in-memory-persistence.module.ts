import { Module } from '@nestjs/common';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserFactory } from 'src/users/domain/factories/user.factory';
import { InMemoryUserRepository } from './repositories/in-memory-user.repository';
import { InMemoryUserMapper } from './mappers/in-memory-user.mapper';

@Module({
  providers: [
    InMemoryUserMapper,
    UserFactory,
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class InMemoryUserPersistenceModule {}
