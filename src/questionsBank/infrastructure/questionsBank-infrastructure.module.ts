import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class QuestionsBankInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: QuestionsBankInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
