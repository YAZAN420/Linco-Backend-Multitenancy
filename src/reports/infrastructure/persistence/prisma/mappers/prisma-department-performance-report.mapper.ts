import { Injectable } from '@nestjs/common';
import { DepartmentPerformanceReport } from 'src/reports/application/interfaces/department-performance-report.interface';
import { DepartmentPerformanceViewRow } from '../types/department-performance-view-row.type';

@Injectable()
export class PrismaDepartmentPerformanceReportMapper {
  toDomain(raw: DepartmentPerformanceViewRow): DepartmentPerformanceReport {
    return {
      departmentId: raw.departmentId,
      departmentName: raw.departmentName,
      manager: raw.manager,
      memberCount: raw.memberCount,
      assignedCourseCount: raw.assignedCourseCount,
      membersWithAttempts: raw.membersWithAttempts,
      examAttempts: raw.examAttempts,
      averageExamScore: raw.averageExamScore,
      examPassRate: raw.examPassRate,
      certificationsEarned: raw.certificationsEarned,
      discussionActivity: raw.discussionActivity,
      messageActivity: raw.messageActivity,
      scheduledLiveStreams: raw.scheduledLiveStreams,
      completedLiveStreams: raw.completedLiveStreams,
    };
  }
}
