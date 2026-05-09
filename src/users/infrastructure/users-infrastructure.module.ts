import { DynamicModule, Module } from '@nestjs/common';
import { InMemoryUserPersistenceModule } from './persistence/in-memory/in-memory-persistence.module';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';
import { DatabaseDriver } from 'src/core/database/database.module';

@Module({})
export class UsersInfrastructureModule {
  static use(driver: DatabaseDriver): DynamicModule {
    const persistenceModule =
      driver === 'prisma'
        ? PrismaPersistenceModule
        : InMemoryUserPersistenceModule;

    return {
      module: UsersInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
