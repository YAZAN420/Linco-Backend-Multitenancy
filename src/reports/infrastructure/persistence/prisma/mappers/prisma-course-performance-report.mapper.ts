import { Injectable } from '@nestjs/common';
import { CoursePerformanceReport } from 'src/reports/application/interfaces/course-performance-report.interface';
import { CoursePerformanceViewRow } from '../types/course-performance-view-row.type';

@Injectable()
export class PrismaCoursePerformanceReportMapper {
  toDomain(raw: CoursePerformanceViewRow): CoursePerformanceReport {
    return {
      courseId: raw.courseId,
      courseTitle: raw.courseTitle,
      isPublished: raw.isPublished,
      visibility: raw.visibility,
      departmentCount: raw.departmentCount,
      assignedMemberCount: raw.assignedMemberCount,
      sectionCount: raw.sectionCount,
      lessonCount: raw.lessonCount,
      totalDuration: raw.totalDuration,
      examCount: raw.examCount,
      membersAttempted: raw.membersAttempted,
      totalAttempts: raw.totalAttempts,
      averageScore: raw.averageScore,
      passRate: raw.passRate,
      certificationsIssued: raw.certificationsIssued,
      certificationRate: raw.certificationRate,
    };
  }
}
