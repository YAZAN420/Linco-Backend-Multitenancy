import { Injectable } from '@nestjs/common';
import { MemberPerformanceReport } from 'src/reports/application/interfaces/member-performance-report.interface';
import { MemberPerformanceViewRow } from '../types/member-performance-view-row.type';

@Injectable()
export class PrismaMemberPerformanceReportMapper {
  toDomain(
    raw: MemberPerformanceViewRow,
    imagePath: string,
  ): MemberPerformanceReport {
    return {
      memberId: raw.memberId,
      userId: raw.userId,
      fullName: raw.fullName,
      email: raw.email,
      imagePath,
      demoRole: raw.demoRole,
      joinedAt: raw.joinedAt,
      departments: raw.departmentIds.map((departmentId, index) => ({
        departmentId,
        departmentName: raw.departmentNames[index],
      })),
      departmentRoles: raw.departmentRoles,
      jobTitle: raw.jobTitles,
      assignedCourses: raw.assignedCourses,
      examAttempts: raw.examAttempts,
      examsPassed: raw.examsPassed,
      examsFailed: raw.examsFailed,
      averageScore: raw.averageScore,
      highestScore: raw.highestScore,
      certificationsEarned: raw.certificationsEarned,
      discussionQuestionsCount: raw.discussionQuestionsCount,
      discussionAnswersCount: raw.discussionAnswersCount,
      messagesCount: raw.messagesCount,
      inquiriesCount: raw.inquiriesCount,
    };
  }
}
