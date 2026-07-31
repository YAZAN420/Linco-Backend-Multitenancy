import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class InquiryRepliesInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: InquiryRepliesInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
