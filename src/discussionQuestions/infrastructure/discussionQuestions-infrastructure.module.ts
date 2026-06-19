import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class DiscussionQuestionsInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: DiscussionQuestionsInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
