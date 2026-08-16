import { CoursePerformanceReport } from '../interfaces/course-performance-report.interface';
import { DemoOwnerReport } from '../interfaces/demo-owner-report.interface';
import { DepartmentPerformanceReport } from '../interfaces/department-performance-report.interface';
import { MemberPerformanceReport } from '../interfaces/member-performance-report.interface';
import { ReportDateRange } from '../interfaces/report-date-range.interface';

export abstract class ReportQueryRepository {
  abstract getDemoOwnerReport(
    demoId: string,
    range: ReportDateRange,
  ): Promise<DemoOwnerReport>;
  abstract getMemberPerformance(
    demoId: string,
  ): Promise<MemberPerformanceReport[]>;
  abstract getCoursePerformance(
    demoId: string,
  ): Promise<CoursePerformanceReport[]>;
  abstract getDepartmentPerformance(
    demoId: string,
  ): Promise<DepartmentPerformanceReport[]>;
}
