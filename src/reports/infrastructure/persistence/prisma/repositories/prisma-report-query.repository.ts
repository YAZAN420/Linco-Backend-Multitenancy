import { Injectable } from '@nestjs/common';
import { ReportUtils } from 'src/common/utils/report.utils';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { LiveStreamStatus, Prisma } from 'src/generated/prisma/client';
import {
  CoursePerformanceReport,
  DemoOwnerReport,
  DepartmentPerformanceReport,
  MemberPerformanceReport,
} from 'src/reports/application/interfaces/demo-owner-report.interface';
import { ReportDateRange } from 'src/reports/application/interfaces/report-date-range.interface';
import { ReportQueryRepository } from 'src/reports/application/ports/report-query.repository';

interface ExamPassingScore {
  id: string;
  passingScore: number;
}

interface DepartmentActivity {
  membersWithAttempts: Set<string>;
  examAttempts: number;
  examScoreTotal: number;
  passedAttempts: number;
  certificationsEarned: number;
  discussionActivity: number;
}

const addToSetMap = <Key, Value>(
  map: Map<Key, Set<Value>>,
  key: Key,
  value: Value,
): void => {
  const values = map.get(key) ?? new Set<Value>();
  values.add(value);
  map.set(key, values);
};

const incrementMap = <Key>(
  map: Map<Key, number>,
  key: Key,
  amount: number,
): void => {
  map.set(key, (map.get(key) ?? 0) + amount);
};

@Injectable()
export class PrismaReportQueryRepository implements ReportQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getDemoOwnerReport(
    demoId: string,
    range: ReportDateRange,
  ): Promise<DemoOwnerReport> {
    const attemptWhere: Prisma.ExamAttemptWhereInput = {
      demoMember: { demoId },
    };

    const [
      demoCounts,
      newMembers,
      publishedCourses,
      certifications,
      attemptStats,
      attemptExams,
      departments,
    ] = await Promise.all([
      this.prisma.demo.findUnique({
        where: { id: demoId },
        select: {
          _count: {
            select: { members: true, departments: true, courses: true },
          },
        },
      }),
      this.prisma.demoMember.count({
        where: { demoId, joinedAt: { gte: range.from, lte: range.to } },
      }),
      this.prisma.course.count({ where: { demoId, isPublished: true } }),
      this.prisma.certification.count({
        where: { demoMember: { demoId } },
      }),
      this.prisma.examAttempt.aggregate({
        where: attemptWhere,
        _count: { _all: true },
        _avg: { score: true },
      }),
      this.prisma.exam.findMany({
        where: { attempts: { some: attemptWhere } },
        select: { id: true, passingScore: true },
      }),
      this.prisma.department.findMany({
        where: { demoId },
        select: { id: true },
      }),
    ]);

    const departmentIds = departments.map((department) => department.id);
    const [memberships, courseAssignments, passedAttempts] = await Promise.all([
      this.prisma.departmentMember.findMany({
        where: { departmentId: { in: departmentIds } },
        select: { departmentId: true, demoMemberId: true },
      }),
      this.prisma.departmentCourse.findMany({
        where: { departmentId: { in: departmentIds } },
        select: {
          departmentId: true,
          asset: { select: { courseId: true } },
        },
      }),
      this.prisma.examAttempt.count({
        where: {
          ...attemptWhere,
          ...this.passedAttemptFilter(attemptExams),
        },
      }),
    ]);

    const assignmentCount = this.countAssignedMemberCourses(
      memberships,
      courseAssignments,
    );
    const totalAttempts = attemptStats._count._all;

    return {
      generatedAt: new Date(),
      totalMembers: demoCounts?._count.members ?? 0,
      newMembers,
      totalDepartments: demoCounts?._count.departments ?? 0,
      totalCourses: demoCounts?._count.courses ?? 0,
      publishedCourses,
      totalCertifications: certifications,
      certificationRate: ReportUtils.rate(certifications, assignmentCount),
      totalExamAttempts: totalAttempts,
      examPassRate: ReportUtils.rate(passedAttempts, totalAttempts),
      averageExamScore: ReportUtils.rounded(attemptStats._avg.score ?? 0),
    };
  }

  async getMemberPerformance(
    demoId: string,
  ): Promise<MemberPerformanceReport[]> {
    const attemptWhere: Prisma.ExamAttemptWhereInput = {
      demoMember: { demoId },
    };

    const [members, attemptStats, attemptExams] = await Promise.all([
      this.prisma.demoMember.findMany({
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
              department: { select: { id: true, name: true } },
            },
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
      }),
      this.prisma.examAttempt.groupBy({
        by: ['demoMemberId'],
        where: attemptWhere,
        _count: { _all: true },
        _avg: { score: true },
        _max: { score: true },
      }),
      this.prisma.exam.findMany({
        where: { attempts: { some: attemptWhere } },
        select: { id: true, passingScore: true },
      }),
    ]);

    if (members.length === 0) return [];

    const memberIds = members.map((member) => member.id);
    const departmentIds = [
      ...new Set(
        members.flatMap((member) =>
          member.accessibleDepartments.map(
            (membership) => membership.department.id,
          ),
        ),
      ),
    ];
    const departmentMemberIds = members.flatMap((member) =>
      member.accessibleDepartments.map((membership) => membership.id),
    );

    const [courseAssignments, messageCounts, passedAttemptStats] =
      await Promise.all([
        this.prisma.departmentCourse.findMany({
          where: { departmentId: { in: departmentIds } },
          select: {
            departmentId: true,
            asset: { select: { courseId: true } },
          },
        }),
        this.prisma.departmentMessage.groupBy({
          by: ['senderId'],
          where: {
            senderId: { in: departmentMemberIds },
            isDeleted: false,
          },
          _count: { _all: true },
        }),
        this.prisma.examAttempt.groupBy({
          by: ['demoMemberId'],
          where: {
            demoMemberId: { in: memberIds },
            ...this.passedAttemptFilter(attemptExams),
          },
          _count: { _all: true },
        }),
      ]);

    const coursesByDepartment = new Map<string, Set<string>>();
    for (const assignment of courseAssignments) {
      addToSetMap(
        coursesByDepartment,
        assignment.departmentId,
        assignment.asset.courseId,
      );
    }

    const attemptsByMember = new Map(
      attemptStats.map((item) => [item.demoMemberId, item]),
    );
    const passedByMember = new Map(
      passedAttemptStats.map((item) => [item.demoMemberId, item._count._all]),
    );
    const messagesByDepartmentMember = new Map(
      messageCounts.map((item) => [item.senderId, item._count._all]),
    );

    return members.map((member) => {
      const assignedCourseIds = new Set<string>();
      const departmentRoles = new Set(
        member.accessibleDepartments.map((membership) => membership.role),
      );
      const jobTitles = new Set(
        member.accessibleDepartments.map((membership) => membership.jobTitle),
      );
      let messagesCount = 0;

      for (const membership of member.accessibleDepartments) {
        const courseIds =
          coursesByDepartment.get(membership.department.id) ?? [];
        for (const courseId of courseIds) assignedCourseIds.add(courseId);
        messagesCount += messagesByDepartmentMember.get(membership.id) ?? 0;
      }

      const stats = attemptsByMember.get(member.id);
      const examAttempts = stats?._count._all ?? 0;
      const examsPassed = passedByMember.get(member.id) ?? 0;

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
        departmentRoles: [...departmentRoles],
        jobTitle: [...jobTitles],
        assignedCourses: assignedCourseIds.size,
        examAttempts,
        examsPassed,
        examsFailed: examAttempts - examsPassed,
        averageScore: ReportUtils.rounded(stats?._avg.score ?? 0),
        highestScore: stats?._max.score ?? 0,
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
    const [courses, assets] = await Promise.all([
      this.prisma.course.findMany({
        where: { demoId },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          title: true,
          isPublished: true,
          visibility: true,
          _count: { select: { sections: true } },
        },
      }),
      this.prisma.asset.findMany({
        where: { demoId, course: { demoId } },
        select: { id: true, courseId: true },
      }),
    ]);

    if (courses.length === 0) return [];

    const courseIds = courses.map((course) => course.id);
    const assetIds = assets.map((asset) => asset.id);
    const courseIdByAsset = new Map(
      assets.map((asset) => [asset.id, asset.courseId]),
    );

    const [sections, departmentAssignments, certificationStats] =
      await Promise.all([
        this.prisma.section.findMany({
          where: { courseId: { in: courseIds } },
          select: {
            id: true,
            courseId: true,
            exam: { select: { id: true, passingScore: true } },
          },
        }),
        this.prisma.departmentCourse.findMany({
          where: { assetId: { in: assetIds } },
          select: { departmentId: true, assetId: true },
        }),
        this.prisma.certification.groupBy({
          by: ['courseId'],
          where: {
            courseId: { in: courseIds },
            demoMember: { demoId },
          },
          _count: { _all: true },
        }),
      ]);

    const sectionIds = sections.map((section) => section.id);
    const departmentIds = [
      ...new Set(
        departmentAssignments.map((assignment) => assignment.departmentId),
      ),
    ];
    const exams = sections.flatMap((section) =>
      section.exam
        ? [
            {
              id: section.exam.id,
              passingScore: section.exam.passingScore,
              courseId: section.courseId,
            },
          ]
        : [],
    );
    const examIds = exams.map((exam) => exam.id);

    const [
      departmentMemberships,
      lessonStats,
      attemptStats,
      passedAttemptStats,
    ] = await Promise.all([
      this.prisma.departmentMember.findMany({
        where: { departmentId: { in: departmentIds } },
        select: { departmentId: true, demoMemberId: true },
      }),
      this.prisma.lesson.groupBy({
        by: ['sectionId'],
        where: { sectionId: { in: sectionIds } },
        _count: { _all: true },
        _sum: { duration: true },
      }),
      this.prisma.examAttempt.groupBy({
        by: ['examId', 'demoMemberId'],
        where: {
          examId: { in: examIds },
          demoMember: { demoId },
        },
        _count: { _all: true },
        _sum: { score: true },
      }),
      this.prisma.examAttempt.groupBy({
        by: ['examId'],
        where: {
          demoMember: { demoId },
          ...this.passedAttemptFilter(exams),
        },
        _count: { _all: true },
      }),
    ]);

    const courseIdBySection = new Map(
      sections.map((section) => [section.id, section.courseId]),
    );
    const courseIdByExam = new Map(
      exams.map((exam) => [exam.id, exam.courseId]),
    );
    const departmentIdsByCourse = new Map<string, Set<string>>();
    for (const assignment of departmentAssignments) {
      const courseId = courseIdByAsset.get(assignment.assetId);
      if (courseId) {
        addToSetMap(departmentIdsByCourse, courseId, assignment.departmentId);
      }
    }

    const memberIdsByDepartment = new Map<string, Set<string>>();
    for (const membership of departmentMemberships) {
      addToSetMap(
        memberIdsByDepartment,
        membership.departmentId,
        membership.demoMemberId,
      );
    }

    const assignedMemberIdsByCourse = new Map<string, Set<string>>();
    for (const [courseId, assignedDepartmentIds] of departmentIdsByCourse) {
      const assignedMemberIds = new Set<string>();
      for (const departmentId of assignedDepartmentIds) {
        const departmentMemberIds =
          memberIdsByDepartment.get(departmentId) ?? [];
        for (const memberId of departmentMemberIds) {
          assignedMemberIds.add(memberId);
        }
      }
      assignedMemberIdsByCourse.set(courseId, assignedMemberIds);
    }

    const lessonCountByCourse = new Map<string, number>();
    const durationByCourse = new Map<string, number>();
    for (const stats of lessonStats) {
      const courseId = courseIdBySection.get(stats.sectionId);
      if (!courseId) continue;
      incrementMap(lessonCountByCourse, courseId, stats._count._all);
      incrementMap(durationByCourse, courseId, stats._sum.duration ?? 0);
    }

    const examCountByCourse = new Map<string, number>();
    for (const exam of exams) incrementMap(examCountByCourse, exam.courseId, 1);

    const attemptsByCourse = new Map<
      string,
      { count: number; scoreTotal: number; members: Set<string> }
    >();
    for (const stats of attemptStats) {
      const courseId = courseIdByExam.get(stats.examId);
      if (!courseId) continue;
      const summary = attemptsByCourse.get(courseId) ?? {
        count: 0,
        scoreTotal: 0,
        members: new Set<string>(),
      };
      summary.count += stats._count._all;
      summary.scoreTotal += stats._sum.score ?? 0;
      summary.members.add(stats.demoMemberId);
      attemptsByCourse.set(courseId, summary);
    }

    const passedByCourse = new Map<string, number>();
    for (const stats of passedAttemptStats) {
      const courseId = courseIdByExam.get(stats.examId);
      if (courseId) {
        incrementMap(passedByCourse, courseId, stats._count._all);
      }
    }

    const certificationsByCourse = new Map(
      certificationStats.map((stats) => [stats.courseId, stats._count._all]),
    );

    return courses.map((course) => {
      const attempts = attemptsByCourse.get(course.id);
      const totalAttempts = attempts?.count ?? 0;
      const assignedMemberCount =
        assignedMemberIdsByCourse.get(course.id)?.size ?? 0;
      const certificationsIssued = certificationsByCourse.get(course.id) ?? 0;

      return {
        courseId: course.id,
        courseTitle: course.title,
        isPublished: course.isPublished,
        visibility: course.visibility,
        departmentCount: departmentIdsByCourse.get(course.id)?.size ?? 0,
        assignedMemberCount,
        sectionCount: course._count.sections,
        lessonCount: lessonCountByCourse.get(course.id) ?? 0,
        totalDuration: durationByCourse.get(course.id) ?? 0,
        examCount: examCountByCourse.get(course.id) ?? 0,
        membersAttempted: attempts?.members.size ?? 0,
        totalAttempts,
        averageScore: totalAttempts
          ? ReportUtils.rounded((attempts?.scoreTotal ?? 0) / totalAttempts)
          : 0,
        passRate: ReportUtils.rate(
          passedByCourse.get(course.id) ?? 0,
          totalAttempts,
        ),
        certificationsIssued,
        certificationRate: ReportUtils.rate(
          certificationsIssued,
          assignedMemberCount,
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
        _count: {
          select: {
            members: true,
            messages: { where: { isDeleted: false } },
          },
        },
      },
    });

    if (departments.length === 0) return [];

    const departmentIds = departments.map((department) => department.id);
    const [memberships, courseAssignments, liveStreamStats] = await Promise.all(
      [
        this.prisma.departmentMember.findMany({
          where: { departmentId: { in: departmentIds } },
          select: { departmentId: true, demoMemberId: true },
        }),
        this.prisma.departmentCourse.findMany({
          where: { departmentId: { in: departmentIds } },
          select: {
            departmentId: true,
            asset: { select: { courseId: true } },
          },
        }),
        this.prisma.liveStream.groupBy({
          by: ['departmentId', 'status'],
          where: {
            departmentId: { in: departmentIds },
            status: {
              in: [LiveStreamStatus.SCHEDULED, LiveStreamStatus.ENDED],
            },
          },
          _count: { _all: true },
        }),
      ],
    );

    const departmentIdsByMember = new Map<string, Set<string>>();
    for (const membership of memberships) {
      addToSetMap(
        departmentIdsByMember,
        membership.demoMemberId,
        membership.departmentId,
      );
    }

    const courseIdsByDepartment = new Map<string, Set<string>>();
    const departmentIdsByCourse = new Map<string, Set<string>>();
    for (const assignment of courseAssignments) {
      addToSetMap(
        courseIdsByDepartment,
        assignment.departmentId,
        assignment.asset.courseId,
      );
      addToSetMap(
        departmentIdsByCourse,
        assignment.asset.courseId,
        assignment.departmentId,
      );
    }

    const memberIds = [...departmentIdsByMember.keys()];
    const courseIds = [...departmentIdsByCourse.keys()];
    const [exams, lessons, certificationStats] = await Promise.all([
      this.prisma.exam.findMany({
        where: { section: { courseId: { in: courseIds } } },
        select: {
          id: true,
          passingScore: true,
          section: { select: { courseId: true } },
        },
      }),
      this.prisma.lesson.findMany({
        where: { section: { courseId: { in: courseIds } } },
        select: {
          id: true,
          section: { select: { courseId: true } },
        },
      }),
      this.prisma.certification.groupBy({
        by: ['demoMemberId', 'courseId'],
        where: {
          demoMemberId: { in: memberIds },
          courseId: { in: courseIds },
        },
        _count: { _all: true },
      }),
    ]);

    const examIds = exams.map((exam) => exam.id);
    const lessonIds = lessons.map((lesson) => lesson.id);
    const examPassingScores = exams.map((exam) => ({
      id: exam.id,
      passingScore: exam.passingScore,
    }));

    const [
      attemptStats,
      passedAttemptStats,
      discussionQuestionStats,
      discussionAnswerStats,
      discussionQuestions,
    ] = await Promise.all([
      this.prisma.examAttempt.groupBy({
        by: ['demoMemberId', 'examId'],
        where: {
          demoMemberId: { in: memberIds },
          examId: { in: examIds },
        },
        _count: { _all: true },
        _sum: { score: true },
      }),
      this.prisma.examAttempt.groupBy({
        by: ['demoMemberId', 'examId'],
        where: {
          demoMemberId: { in: memberIds },
          ...this.passedAttemptFilter(examPassingScores),
        },
        _count: { _all: true },
      }),
      this.prisma.discussionQuestion.groupBy({
        by: ['demoMemberId', 'lessonId'],
        where: {
          demoMemberId: { in: memberIds },
          lessonId: { in: lessonIds },
        },
        _count: { _all: true },
      }),
      this.prisma.discussionAnswer.groupBy({
        by: ['demoMemberId', 'discussionId'],
        where: {
          demoMemberId: { in: memberIds },
          discussion: { lessonId: { in: lessonIds } },
        },
        _count: { _all: true },
      }),
      this.prisma.discussionQuestion.findMany({
        where: { lessonId: { in: lessonIds } },
        select: { id: true, lessonId: true },
      }),
    ]);

    const courseIdByExam = new Map(
      exams.map((exam) => [exam.id, exam.section.courseId]),
    );
    const courseIdByLesson = new Map(
      lessons.map((lesson) => [lesson.id, lesson.section.courseId]),
    );
    const lessonIdByDiscussion = new Map(
      discussionQuestions.map((question) => [question.id, question.lessonId]),
    );
    const activityByDepartment = new Map<string, DepartmentActivity>();
    for (const departmentId of departmentIds) {
      activityByDepartment.set(departmentId, {
        membersWithAttempts: new Set<string>(),
        examAttempts: 0,
        examScoreTotal: 0,
        passedAttempts: 0,
        certificationsEarned: 0,
        discussionActivity: 0,
      });
    }

    for (const stats of attemptStats) {
      const courseId = courseIdByExam.get(stats.examId);
      if (!courseId) continue;
      this.forEachMatchingDepartment(
        stats.demoMemberId,
        courseId,
        departmentIdsByMember,
        departmentIdsByCourse,
        (departmentId) => {
          const activity = activityByDepartment.get(departmentId);
          if (!activity) return;
          activity.examAttempts += stats._count._all;
          activity.examScoreTotal += stats._sum.score ?? 0;
          activity.membersWithAttempts.add(stats.demoMemberId);
        },
      );
    }

    for (const stats of passedAttemptStats) {
      const courseId = courseIdByExam.get(stats.examId);
      if (!courseId) continue;
      this.forEachMatchingDepartment(
        stats.demoMemberId,
        courseId,
        departmentIdsByMember,
        departmentIdsByCourse,
        (departmentId) => {
          const activity = activityByDepartment.get(departmentId);
          if (activity) activity.passedAttempts += stats._count._all;
        },
      );
    }

    for (const stats of certificationStats) {
      this.forEachMatchingDepartment(
        stats.demoMemberId,
        stats.courseId,
        departmentIdsByMember,
        departmentIdsByCourse,
        (departmentId) => {
          const activity = activityByDepartment.get(departmentId);
          if (activity) activity.certificationsEarned += stats._count._all;
        },
      );
    }

    for (const stats of discussionQuestionStats) {
      const courseId = courseIdByLesson.get(stats.lessonId);
      if (!courseId) continue;
      this.forEachMatchingDepartment(
        stats.demoMemberId,
        courseId,
        departmentIdsByMember,
        departmentIdsByCourse,
        (departmentId) => {
          const activity = activityByDepartment.get(departmentId);
          if (activity) activity.discussionActivity += stats._count._all;
        },
      );
    }

    for (const stats of discussionAnswerStats) {
      const lessonId = lessonIdByDiscussion.get(stats.discussionId);
      const courseId = lessonId ? courseIdByLesson.get(lessonId) : undefined;
      if (!courseId) continue;
      this.forEachMatchingDepartment(
        stats.demoMemberId,
        courseId,
        departmentIdsByMember,
        departmentIdsByCourse,
        (departmentId) => {
          const activity = activityByDepartment.get(departmentId);
          if (activity) activity.discussionActivity += stats._count._all;
        },
      );
    }

    const liveStreamsByDepartment = new Map<
      string,
      { scheduled: number; completed: number }
    >();
    for (const stats of liveStreamStats) {
      const streamCounts = liveStreamsByDepartment.get(stats.departmentId) ?? {
        scheduled: 0,
        completed: 0,
      };
      if (stats.status === LiveStreamStatus.SCHEDULED) {
        streamCounts.scheduled = stats._count._all;
      } else if (stats.status === LiveStreamStatus.ENDED) {
        streamCounts.completed = stats._count._all;
      }
      liveStreamsByDepartment.set(stats.departmentId, streamCounts);
    }

    return departments.map((department) => {
      const activity = activityByDepartment.get(department.id);
      const examAttempts = activity?.examAttempts ?? 0;
      const liveStreams = liveStreamsByDepartment.get(department.id);

      return {
        departmentId: department.id,
        departmentName: department.name,
        manager:
          `${department.manager.user.firstName} ${department.manager.user.lastName}`.trim(),
        memberCount: department._count.members,
        assignedCourseCount:
          courseIdsByDepartment.get(department.id)?.size ?? 0,
        membersWithAttempts: activity?.membersWithAttempts.size ?? 0,
        examAttempts,
        averageExamScore: examAttempts
          ? ReportUtils.rounded((activity?.examScoreTotal ?? 0) / examAttempts)
          : 0,
        examPassRate: ReportUtils.rate(
          activity?.passedAttempts ?? 0,
          examAttempts,
        ),
        certificationsEarned: activity?.certificationsEarned ?? 0,
        discussionActivity: activity?.discussionActivity ?? 0,
        messageActivity: department._count.messages,
        scheduledLiveStreams: liveStreams?.scheduled ?? 0,
        completedLiveStreams: liveStreams?.completed ?? 0,
      };
    });
  }

  private passedAttemptFilter(
    exams: ExamPassingScore[],
  ): Prisma.ExamAttemptWhereInput {
    const examIdsByPassingScore = new Map<number, string[]>();
    for (const exam of exams) {
      const examIds = examIdsByPassingScore.get(exam.passingScore) ?? [];
      examIds.push(exam.id);
      examIdsByPassingScore.set(exam.passingScore, examIds);
    }

    const conditions: Prisma.ExamAttemptWhereInput[] = [];
    for (const [passingScore, examIds] of examIdsByPassingScore) {
      conditions.push({
        examId: { in: examIds },
        score: { gte: passingScore },
      });
    }

    return conditions.length > 0 ? { OR: conditions } : { examId: { in: [] } };
  }

  private countAssignedMemberCourses(
    memberships: { departmentId: string; demoMemberId: string }[],
    courseAssignments: {
      departmentId: string;
      asset: { courseId: string };
    }[],
  ): number {
    const coursesByDepartment = new Map<string, Set<string>>();
    for (const assignment of courseAssignments) {
      addToSetMap(
        coursesByDepartment,
        assignment.departmentId,
        assignment.asset.courseId,
      );
    }

    const coursesByMember = new Map<string, Set<string>>();
    for (const membership of memberships) {
      const courseIds = coursesByDepartment.get(membership.departmentId) ?? [];
      for (const courseId of courseIds) {
        addToSetMap(coursesByMember, membership.demoMemberId, courseId);
      }
    }

    let total = 0;
    for (const courseIds of coursesByMember.values()) total += courseIds.size;
    return total;
  }

  private forEachMatchingDepartment(
    memberId: string,
    courseId: string,
    departmentIdsByMember: Map<string, Set<string>>,
    departmentIdsByCourse: Map<string, Set<string>>,
    callback: (departmentId: string) => void,
  ): void {
    const memberDepartmentIds = departmentIdsByMember.get(memberId);
    const courseDepartmentIds = departmentIdsByCourse.get(courseId);
    if (!memberDepartmentIds || !courseDepartmentIds) return;

    const [smallerSet, largerSet] =
      memberDepartmentIds.size <= courseDepartmentIds.size
        ? [memberDepartmentIds, courseDepartmentIds]
        : [courseDepartmentIds, memberDepartmentIds];

    for (const departmentId of smallerSet) {
      if (largerSet.has(departmentId)) callback(departmentId);
    }
  }
}
