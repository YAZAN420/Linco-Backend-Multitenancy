import {
  CoursePerformanceReport,
  DemoOwnerReport,
  DepartmentPerformanceReport,
  MemberPerformanceReport,
} from '../interfaces/demo-owner-report.interface';
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
