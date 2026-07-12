import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class CourseFaqsInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: CourseFaqsInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
