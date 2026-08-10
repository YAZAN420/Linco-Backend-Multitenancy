import { Module } from '@nestjs/common';
import { DashboardQueryRepository } from 'src/dashboard/application/ports/dashboard-query.repository';
import { PrismaDashboardQueryRepository } from './repositories/prisma-dashboard-query.repository';

@Module({
  providers: [
    {
      provide: DashboardQueryRepository,
      useClass: PrismaDashboardQueryRepository,
    },
  ],
  exports: [DashboardQueryRepository],
})
export class PrismaPersistenceModule {}
