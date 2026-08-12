import { Module } from '@nestjs/common';
import { ReportQueryRepository } from 'src/reports/application/ports/report-query.repository';
import { PrismaReportQueryRepository } from './repositories/prisma-report-query.repository';

@Module({
  providers: [
    {
      provide: ReportQueryRepository,
      useClass: PrismaReportQueryRepository,
    },
  ],
  exports: [ReportQueryRepository],
})
export class PrismaPersistenceModule {}
