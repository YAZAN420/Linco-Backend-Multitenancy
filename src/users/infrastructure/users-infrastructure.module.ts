import { Module } from '@nestjs/common';
import { MongooseUserPersistenceModule } from './persistence/mongoose/mongoose-persistence.module';
import { InMemoryUserPersistenceModule } from './persistence/in-memory/in-memory-persistence.module';

@Module({})
export class UsersInfrastructureModule {
  static use(driver: 'mongo' | 'memory') {
    const persistenceModule =
      driver === 'mongo'
        ? MongooseUserPersistenceModule
        : InMemoryUserPersistenceModule;

    return {
      module: UsersInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
