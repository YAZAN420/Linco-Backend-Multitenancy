import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class CoursesInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: CoursesInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
