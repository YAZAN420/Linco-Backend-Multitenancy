import { Module } from '@nestjs/common';
import { UserRepository } from 'src/users/application/ports/user.repository';
import { UserFactory } from 'src/users/domain/factories/user.factory';
import { UserMapper } from '../../shared/user.mapper';
import { InMemoryUserRepository } from './repositories/in-memory-user.repository';

@Module({
  providers: [
    UserFactory,
    UserMapper,
    {
      provide: UserRepository,
      useClass: InMemoryUserRepository,
    },
  ],
  exports: [UserRepository],
})
export class InMemoryUserPersistenceModule {}
