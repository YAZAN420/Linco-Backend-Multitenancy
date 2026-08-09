import { DynamicModule, Module } from '@nestjs/common';
import { PrismaPersistenceModule } from './persistence/prisma/prisma-persistence.module';

@Module({})
export class CertificationsInfrastructureModule {
  static use(): DynamicModule {
    return {
      module: CertificationsInfrastructureModule,
      imports: [PrismaPersistenceModule],
      exports: [PrismaPersistenceModule],
    };
  }
}
