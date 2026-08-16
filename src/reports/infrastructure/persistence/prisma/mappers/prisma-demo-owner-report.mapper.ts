import { Injectable } from '@nestjs/common';
import { DemoOwnerReport } from 'src/reports/application/interfaces/demo-owner-report.interface';
import { DemoOwnerReportViewRow } from '../types/demo-owner-report-view-row.type';

@Injectable()
export class PrismaDemoOwnerReportMapper {
  toDomain(
    raw: DemoOwnerReportViewRow | null,
    newMembers: number,
  ): DemoOwnerReport {
    if (!raw) {
      return {
        generatedAt: new Date(),
        totalMembers: 0,
        newMembers: 0,
        totalDepartments: 0,
        totalCourses: 0,
        publishedCourses: 0,
        totalCertifications: 0,
        certificationRate: 0,
        totalExamAttempts: 0,
        examPassRate: 0,
        averageExamScore: 0,
      };
    }

    return {
      generatedAt: new Date(),
      totalMembers: raw.totalMembers,
      newMembers,
      totalDepartments: raw.totalDepartments,
      totalCourses: raw.totalCourses,
      publishedCourses: raw.publishedCourses,
      totalCertifications: raw.totalCertifications,
      certificationRate: raw.certificationRate,
      totalExamAttempts: raw.totalExamAttempts,
      examPassRate: raw.examPassRate,
      averageExamScore: raw.averageExamScore,
    };
  }
}
