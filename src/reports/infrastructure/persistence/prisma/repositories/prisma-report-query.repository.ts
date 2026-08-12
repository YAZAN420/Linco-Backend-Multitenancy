import { Injectable } from '@nestjs/common';
import {
  CoursePerformanceReport,
  DemoOwnerReport,
  DepartmentPerformanceReport,
  MemberPerformanceReport,
} from 'src/reports/application/interfaces/demo-owner-report.interface';
import { ReportDateRange } from 'src/reports/application/interfaces/report-date-range.interface';
import { ReportQueryRepository } from 'src/reports/application/ports/report-query.repository';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

const rounded = (value: number) => Math.round(value * 100) / 100;
const average = (values: number[]) => values.length ? rounded(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
const rate = (part: number, total: number) => total ? rounded((part / total) * 100) : 0;

@Injectable()
export class PrismaReportQueryRepository implements ReportQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDemoOwnerReport(
    demoId: string,
    range: ReportDateRange,
  ): Promise<DemoOwnerReport> {
    const [
      totalMembers,
      newMembers,
      totalDepartments,
      totalCourses,
      publishedCourses,
      certifications,
      attempts,
      departments,
    ] = await Promise.all([
      this.prisma.demoMember.count({ where: { demoId } }),
      this.prisma.demoMember.count({
        where: { demoId, joinedAt: { gte: range.from, lte: range.to } },
      }),
      this.prisma.department.count({ where: { demoId } }),
      this.prisma.course.count({ where: { demoId } }),
      this.prisma.course.count({ where: { demoId, isPublished: true } }),
      this.prisma.certification.count({ where: { demoMember: { demoId } } }),
      this.prisma.examAttempt.findMany({
        where: { demoMember: { demoId } },
        select: { score: true, exam: { select: { passingScore: true } } },
      }),
      this.prisma.department.findMany({
        where: { demoId },
        select: {
          members: { select: { demoMemberId: true } },
          courses: { select: { asset: { select: { courseId: true } } } },
        },
      }),
    ]);

    const assignments = new Set<string>();
    for (const department of departments) {
      for (const member of department.members) {
        for (const course of department.courses) {
          assignments.add(`${member.demoMemberId}:${course.asset.courseId}`);
        }
      }
    }
    const passed = attempts.filter(
      (attempt) => attempt.score >= attempt.exam.passingScore,
    ).length;

    return {
      generatedAt: new Date(),
      totalMembers,
      newMembers,
      totalDepartments,
      totalCourses,
      publishedCourses,
      totalCertifications: certifications,
      certificationRate: rate(certifications, assignments.size),
      totalExamAttempts: attempts.length,
      examPassRate: rate(passed, attempts.length),
      averageExamScore: average(attempts.map((attempt) => attempt.score)),
    };
  }

  async getMemberPerformance(
    demoId: string,
  ): Promise<MemberPerformanceReport[]> {
    const members = await this.prisma.demoMember.findMany({
      where: { demoId },
      orderBy: [{ joinedAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        userId: true,
        role: true,
        joinedAt: true,
        user: { select: { firstName: true, lastName: true, email: true } },
        accessibleDepartments: {
          select: {
            id: true,
            role: true,
            jobTitle: true,
            department: {
              select: {
                id: true,
                name: true,
                courses: { select: { asset: { select: { courseId: true } } } },
              },
            },
          },
        },
        examAttempts: {
          select: { score: true, exam: { select: { passingScore: true } } },
        },
        _count: {
          select: {
            certifications: true,
            discussionQuestions: true,
            discussionAnswers: true,
            createdInquiries: true,
          },
        },
      },
    });

    const messageCounts = await this.prisma.departmentMessage.groupBy({
      by: ['senderId'],
      where: { sender: { demoMember: { demoId } }, isDeleted: false },
      _count: { _all: true },
    });
    const messagesByDepartmentMember = new Map(
      messageCounts.map((item) => [item.senderId, item._count._all]),
    );

    return members.map((member) => {
      const courseIds = new Set(
        member.accessibleDepartments.flatMap((membership) =>
          membership.department.courses.map((item) => item.asset.courseId),
        ),
      );
      const passed = member.examAttempts.filter(
        (attempt) => attempt.score >= attempt.exam.passingScore,
      ).length;
      const messagesCount = member.accessibleDepartments.reduce(
        (total, membership) =>
          total + (messagesByDepartmentMember.get(membership.id) ?? 0),
        0,
      );

      return {
        memberId: member.id,
        userId: member.userId,
        fullName: `${member.user.firstName} ${member.user.lastName}`.trim(),
        email: member.user.email,
        demoRole: member.role,
        joinedAt: member.joinedAt,
        departments: member.accessibleDepartments.map((membership) => ({
          departmentId: membership.department.id,
          departmentName: membership.department.name,
        })),
        departmentRoles: [
          ...new Set(member.accessibleDepartments.map((item) => item.role)),
        ],
        jobTitle: [
          ...new Set(member.accessibleDepartments.map((item) => item.jobTitle)),
        ],
        assignedCourses: courseIds.size,
        examAttempts: member.examAttempts.length,
        examsPassed: passed,
        examsFailed: member.examAttempts.length - passed,
        averageScore: average(
          member.examAttempts.map((attempt) => attempt.score),
        ),
        highestScore: member.examAttempts.length
          ? Math.max(...member.examAttempts.map((attempt) => attempt.score))
          : 0,
        certificationsEarned: member._count.certifications,
        discussionQuestionsCount: member._count.discussionQuestions,
        discussionAnswersCount: member._count.discussionAnswers,
        messagesCount,
        inquiriesCount: member._count.createdInquiries,
      };
    });
  }

  async getCoursePerformance(
    demoId: string,
  ): Promise<CoursePerformanceReport[]> {
    const courses = await this.prisma.course.findMany({
      where: { demoId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        title: true,
        isPublished: true,
        visibility: true,
        sections: {
          select: {
            lessons: { select: { duration: true } },
            exam: {
              select: {
                passingScore: true,
                attempts: {
                  where: { demoMember: { demoId } },
                  select: { demoMemberId: true, score: true },
                },
              },
            },
          },
        },
        assets: {
          where: { demoId },
          select: {
            departments: {
              select: {
                departmentId: true,
                department: {
                  select: { members: { select: { demoMemberId: true } } },
                },
              },
            },
          },
        },
        certifications: {
          where: { demoMember: { demoId } },
          select: { demoMemberId: true },
        },
      },
    });

    return courses.map((course) => {
      const departments = course.assets.flatMap((asset) => asset.departments);
      const assignedMembers = new Set(
        departments.flatMap((item) =>
          item.department.members.map((member) => member.demoMemberId),
        ),
      );
      const exams = course.sections.flatMap((section) =>
        section.exam ? [section.exam] : [],
      );
      const attempts = exams.flatMap((exam) =>
        exam.attempts.map((attempt) => ({
          ...attempt,
          passingScore: exam.passingScore,
        })),
      );
      const passed = attempts.filter(
        (attempt) => attempt.score >= attempt.passingScore,
      ).length;

      return {
        courseId: course.id,
        courseTitle: course.title,
        isPublished: course.isPublished,
        visibility: course.visibility,
        departmentCount: new Set(departments.map((item) => item.departmentId))
          .size,
        assignedMemberCount: assignedMembers.size,
        sectionCount: course.sections.length,
        lessonCount: course.sections.reduce(
          (sum, section) => sum + section.lessons.length,
          0,
        ),
        totalDuration: course.sections.reduce(
          (sum, section) =>
            sum +
            section.lessons.reduce(
              (lessonSum, lesson) => lessonSum + lesson.duration,
              0,
            ),
          0,
        ),
        examCount: exams.length,
        membersAttempted: new Set(
          attempts.map((attempt) => attempt.demoMemberId),
        ).size,
        totalAttempts: attempts.length,
        averageScore: average(attempts.map((attempt) => attempt.score)),
        passRate: rate(passed, attempts.length),
        certificationsIssued: course.certifications.length,
        certificationRate: rate(
          course.certifications.length,
          assignedMembers.size,
        ),
      };
    });
  }

  async getDepartmentPerformance(
    demoId: string,
  ): Promise<DepartmentPerformanceReport[]> {
    const departments = await this.prisma.department.findMany({
      where: { demoId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        name: true,
        manager: {
          select: { user: { select: { firstName: true, lastName: true } } },
        },
        courses: { select: { asset: { select: { courseId: true } } } },
        members: {
          select: {
            demoMember: {
              select: {
                id: true,
                examAttempts: {
                  select: {
                    score: true,
                    exam: {
                      select: {
                        passingScore: true,
                        section: { select: { courseId: true } },
                      },
                    },
                  },
                },
                certifications: { select: { courseId: true } },
                discussionQuestions: {
                  select: {
                    lesson: {
                      select: { section: { select: { courseId: true } } },
                    },
                  },
                },
                discussionAnswers: {
                  select: {
                    discussion: {
                      select: {
                        lesson: {
                          select: { section: { select: { courseId: true } } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        messages: { where: { isDeleted: false }, select: { id: true } },
        liveStreams: { select: { status: true } },
      },
    });

    return departments.map((department) => {
      const courseIds = new Set(
        department.courses.map((item) => item.asset.courseId),
      );
      const attempts = department.members.flatMap((item) =>
        item.demoMember.examAttempts.filter((attempt) =>
          courseIds.has(attempt.exam.section.courseId),
        ),
      );
      const passed = attempts.filter(
        (attempt) => attempt.score >= attempt.exam.passingScore,
      ).length;
      const membersWithAttempts = new Set(
        department.members
          .filter((item) =>
            item.demoMember.examAttempts.some((attempt) =>
              courseIds.has(attempt.exam.section.courseId),
            ),
          )
          .map((item) => item.demoMember.id),
      ).size;
      const certificationsEarned = department.members.reduce(
        (sum, item) =>
          sum +
          item.demoMember.certifications.filter((certification) =>
            courseIds.has(certification.courseId),
          ).length,
        0,
      );
      const discussionActivity = department.members.reduce(
        (sum, item) =>
          sum +
          item.demoMember.discussionQuestions.filter((question) =>
            courseIds.has(question.lesson.section.courseId),
          ).length +
          item.demoMember.discussionAnswers.filter((answer) =>
            courseIds.has(answer.discussion.lesson.section.courseId),
          ).length,
        0,
      );

      return {
        departmentId: department.id,
        departmentName: department.name,
        manager:
          `${department.manager.user.firstName} ${department.manager.user.lastName}`.trim(),
        memberCount: department.members.length,
        assignedCourseCount: courseIds.size,
        membersWithAttempts,
        examAttempts: attempts.length,
        averageExamScore: average(attempts.map((attempt) => attempt.score)),
        examPassRate: rate(passed, attempts.length),
        certificationsEarned,
        discussionActivity,
        messageActivity: department.messages.length,
        scheduledLiveStreams: department.liveStreams.filter(
          (stream) => stream.status === 'SCHEDULED',
        ).length,
        completedLiveStreams: department.liveStreams.filter(
          (stream) => stream.status === 'ENDED',
        ).length,
      };
    });
  }
}
