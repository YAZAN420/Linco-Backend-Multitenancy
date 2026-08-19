import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { CoursePerformanceReport } from 'src/reports/application/interfaces/course-performance-report.interface';
import { DemoOwnerReport } from 'src/reports/application/interfaces/demo-owner-report.interface';
import { DepartmentPerformanceReport } from 'src/reports/application/interfaces/department-performance-report.interface';
import { MemberPerformanceReport } from 'src/reports/application/interfaces/member-performance-report.interface';
import { ReportDateRange } from 'src/reports/application/interfaces/report-date-range.interface';
import { ReportQueryRepository } from 'src/reports/application/ports/report-query.repository';
import { PrismaCoursePerformanceReportMapper } from '../mappers/prisma-course-performance-report.mapper';
import { PrismaDemoOwnerReportMapper } from '../mappers/prisma-demo-owner-report.mapper';
import { PrismaDepartmentPerformanceReportMapper } from '../mappers/prisma-department-performance-report.mapper';
import { PrismaMemberPerformanceReportMapper } from '../mappers/prisma-member-performance-report.mapper';

@Injectable()
export class PrismaReportQueryRepository implements ReportQueryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly demoOwnerReportMapper: PrismaDemoOwnerReportMapper,
    private readonly memberPerformanceReportMapper: PrismaMemberPerformanceReportMapper,
    private readonly coursePerformanceReportMapper: PrismaCoursePerformanceReportMapper,
    private readonly departmentPerformanceReportMapper: PrismaDepartmentPerformanceReportMapper,
  ) {}

  async getDemoOwnerReport(
    demoId: string,
    range: ReportDateRange,
  ): Promise<DemoOwnerReport> {
    const [report, newMembers] = await Promise.all([
      this.prisma.demoOwnerReportView.findUnique({
        where: { id: `summary:${demoId}`, demoId, memberId: null },
      }),
      this.prisma.demoOwnerReportView.count({
        where: {
          demoId,
          memberJoinedAt: { gte: range.from, lte: range.to },
        },
      }),
    ]);

    return this.demoOwnerReportMapper.toDomain(report, newMembers);
  }

  async getMemberPerformance(
    demoId: string,
  ): Promise<MemberPerformanceReport[]> {
    const reportRows = await this.prisma.memberPerformanceView.findMany({
      where: { demoId },
      orderBy: [{ joinedAt: 'desc' }, { memberId: 'desc' }],
    });

    const users = await this.prisma.user.findMany({
      where: { id: { in: reportRows.map((row) => row.userId) } },
      select: { id: true, imagePath: true },
    });
    const imagePathByUserId = new Map(
      users.map((user) => [user.id, user.imagePath]),
    );

    return reportRows.map((row) =>
      this.memberPerformanceReportMapper.toDomain(
        row,
        imagePathByUserId.get(row.userId) ?? '',
      ),
    );
  }

  async getCoursePerformance(
    demoId: string,
  ): Promise<CoursePerformanceReport[]> {
    const reportRows = await this.prisma.coursePerformanceView.findMany({
      where: { demoId },
      orderBy: [{ createdAt: 'desc' }, { courseId: 'desc' }],
    });

    return reportRows.map((row) =>
      this.coursePerformanceReportMapper.toDomain(row),
    );
  }

  async getDepartmentPerformance(
    demoId: string,
  ): Promise<DepartmentPerformanceReport[]> {
    const reportRows = await this.prisma.departmentPerformanceView.findMany({
      where: { demoId },
      orderBy: [{ createdAt: 'desc' }, { departmentId: 'desc' }],
    });

    return reportRows.map((row) =>
      this.departmentPerformanceReportMapper.toDomain(row),
    );
  }
}
