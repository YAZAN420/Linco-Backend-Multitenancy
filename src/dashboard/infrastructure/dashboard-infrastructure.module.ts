import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class DashboardInfrastructureModule {
  static use(): DynamicModule {
    return {
      module: DashboardInfrastructureModule,
      imports: [PrismaPersistenceModule],
      exports: [PrismaPersistenceModule],
    };
  }
}
