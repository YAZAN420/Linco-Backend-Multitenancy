import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class ReportsInfrastructureModule {
  static use(): DynamicModule {
    return {
      module: ReportsInfrastructureModule,
      imports: [PrismaPersistenceModule],
      exports: [PrismaPersistenceModule],
    };
  }
}
