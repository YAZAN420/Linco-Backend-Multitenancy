import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class InquiriesInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: InquiriesInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
