import { DynamicModule, Module } from '@nestjs/common';

import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class UsersInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: UsersInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
