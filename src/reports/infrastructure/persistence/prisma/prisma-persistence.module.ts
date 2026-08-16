import { Module } from '@nestjs/common';
import { ReportQueryRepository } from 'src/reports/application/ports/report-query.repository';
import { PrismaCoursePerformanceReportMapper } from './mappers/prisma-course-performance-report.mapper';
import { PrismaDemoOwnerReportMapper } from './mappers/prisma-demo-owner-report.mapper';
import { PrismaDepartmentPerformanceReportMapper } from './mappers/prisma-department-performance-report.mapper';
import { PrismaMemberPerformanceReportMapper } from './mappers/prisma-member-performance-report.mapper';
import { PrismaReportQueryRepository } from './repositories/prisma-report-query.repository';

@Module({
  providers: [
    PrismaDemoOwnerReportMapper,
    PrismaMemberPerformanceReportMapper,
    PrismaCoursePerformanceReportMapper,
    PrismaDepartmentPerformanceReportMapper,
    {
      provide: ReportQueryRepository,
      useClass: PrismaReportQueryRepository,
    },
  ],
  exports: [ReportQueryRepository],
})
export class PrismaPersistenceModule {}
