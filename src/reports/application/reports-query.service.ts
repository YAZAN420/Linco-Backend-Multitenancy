import { Injectable } from '@nestjs/common';
import { ReportDateRange } from './interfaces/report-date-range.interface';
import { ReportQueryRepository } from './ports/report-query.repository';

@Injectable()
export class ReportsQueryService {
  constructor(private readonly repository: ReportQueryRepository) {}

  async getFullDemoOwnerReport(demoId: string, range: ReportDateRange) {
    const [overview, members, courses, departments] = await Promise.all([
      this.repository.getDemoOwnerReport(demoId, range),
      this.repository.getMemberPerformance(demoId),
      this.repository.getCoursePerformance(demoId),
      this.repository.getDepartmentPerformance(demoId),
    ]);

    return { overview, members, courses, departments };
  }

  getDemoOwnerReport(demoId: string, range: ReportDateRange) {
    return this.repository.getDemoOwnerReport(demoId, range);
  }

  getMemberPerformance(demoId: string) {
    return this.repository.getMemberPerformance(demoId);
  }

  getCoursePerformance(demoId: string) {
    return this.repository.getCoursePerformance(demoId);
  }

  getDepartmentPerformance(demoId: string) {
    return this.repository.getDepartmentPerformance(demoId);
  }
}
