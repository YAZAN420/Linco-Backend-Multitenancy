import { Module } from '@nestjs/common';
import { DashboardQueryRepository } from 'src/dashboard/application/ports/dashboard-query.repository';
import { PrismaDashboardAnalyticsMapper } from './mappers/prisma-dashboard-analytics.mapper';
import { PrismaDashboardQueryRepository } from './repositories/prisma-dashboard-query.repository';

@Module({
  providers: [
    PrismaDashboardAnalyticsMapper,
    {
      provide: DashboardQueryRepository,
      useClass: PrismaDashboardQueryRepository,
    },
  ],
  exports: [DashboardQueryRepository],
})
export class PrismaPersistenceModule {}
