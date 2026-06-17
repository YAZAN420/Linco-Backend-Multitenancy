import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class QuestionsBanksInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: QuestionsBanksInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
