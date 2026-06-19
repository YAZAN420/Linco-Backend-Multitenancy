import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class DepartmentCoursesInfrastructureModule {
  static use(): DynamicModule {
    const persistenceModule = PrismaPersistenceModule;

    return {
      module: DepartmentCoursesInfrastructureModule,
      imports: [persistenceModule],
      exports: [persistenceModule],
    };
  }
}
