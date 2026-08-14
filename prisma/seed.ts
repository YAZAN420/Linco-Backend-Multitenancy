import 'dotenv/config';
import { hash } from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import {
  AccessMethod,
  CourseVisibility,
  DemoMemberRole,
  DepartmentMemberRole,
  InquirySenderType,
  InvitationStatus,
  JobTitle,
  LiveStreamStatus,
  MessageType,
  PaymentStatus,
  PaymentType,
  PlanTier,
  PrismaClient,
  SubscriptionStatus,
} from '../src/generated/prisma/client';

const COUNT = 15;
const id = (model: string, index: number) =>
  `seed-${model}-${String(index + 1).padStart(3, '0')}`;
const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function clearPreviousSeed() {
  // Deleting seed demos cascades through every workspace-owned seed record.
  await prisma.demo.deleteMany({ where: { id: { startsWith: 'seed-' } } });
  await prisma.tag.deleteMany({ where: { id: { startsWith: 'seed-' } } });
  await prisma.fcmToken.deleteMany({ where: { id: { startsWith: 'seed-' } } });
  await prisma.user.deleteMany({ where: { id: { startsWith: 'seed-' } } });
}

async function seed() {
  await clearPreviousSeed();
  const password = await hash('Seed@2026', 10);

  await prisma.user.createMany({
    data: Array.from({ length: COUNT * 2 }, (_, index) => ({
      id: id('user', index),
      firstName: `Seed${index + 1}`,
      lastName: index < COUNT ? 'Owner' : 'Member',
      email: `seed.user${index + 1}@example.com`,
      password,
      birthDate: new Date(1990 + (index % 10), index % 12, (index % 27) + 1),
      imagePath: `https://placehold.co/256?text=User${index + 1}`,
      isEmailVerified: true,
      createdAt: daysAgo(COUNT * 2 - index),
      lastActiveAt: daysAgo(index % 7),
    })),
  });

  await prisma.demo.createMany({
    data: Array.from({ length: COUNT }, (_, index) => ({
      id: id('demo', index),
      name:
        index === 0 ? 'Seed Analytics Academy' : `Seed Workspace ${index + 1}`,
      imagePath: `https://placehold.co/600x400?text=Demo${index + 1}`,
      signatureImagePath: 'https://placehold.co/800x200?text=Signature',
      description: `Seeded workspace ${index + 1} for development and reporting.`,
      plan: [PlanTier.FREE, PlanTier.STARTER, PlanTier.PRO][index % 3],
      subscriptionStatus:
        index % 4 === 0
          ? SubscriptionStatus.TRIALING
          : SubscriptionStatus.ACTIVE,
      currentPeriodEnd: new Date(Date.now() + (14 + index) * 86400000),
      ownerId: id('user', index),
      createdAt: daysAgo(COUNT - index),
    })),
  });

  const ownerMemberships = Array.from({ length: COUNT }, (_, index) => ({
    id: id('member-owner', index),
    userId: id('user', index),
    demoId: id('demo', index),
    role: DemoMemberRole.OWNER,
    joinedAt: daysAgo(COUNT - index),
  }));
  const primaryMembers = Array.from({ length: COUNT }, (_, index) => ({
    id: id('member', index),
    userId: id('user', COUNT + index),
    demoId: id('demo', 0),
    role: index < 3 ? DemoMemberRole.ADMIN : DemoMemberRole.MEMBER,
    joinedAt: daysAgo(index),
  }));
  await prisma.demoMember.createMany({
    data: [...ownerMemberships, ...primaryMembers],
  });

  await prisma.invitation.createMany({
    data: Array.from({ length: COUNT }, (_, index) => ({
      id: id('invitation', index),
      demoId: id('demo', 0),
      receiverId: id('user', COUNT + index),
      senderId: id('user', 0),
      role: index < 3 ? DemoMemberRole.ADMIN : DemoMemberRole.MEMBER,
      status: InvitationStatus.ACCEPTED,
      createdAt: daysAgo(index + 1),
    })),
  });

  await prisma.department.createMany({
    data: Array.from({ length: COUNT }, (_, index) => ({
      id: id('department', index),
      name:
        ['Engineering', 'Customer Success', 'Sales', 'Marketing', 'Product'][
          index % 5
        ] + ` ${Math.floor(index / 5) + 1}`,
      description: `Seed department ${index + 1}`,
      managerId: index === 0 ? id('member-owner', 0) : id('member', index - 1),
      demoId: id('demo', 0),
      createdAt: daysAgo(COUNT - index),
    })),
  });

  const departmentMembers = Array.from({ length: COUNT }, (_, index) => ({
    id: id('department-member', index),
    departmentId: id('department', index),
    demoMemberId: index === 0 ? id('member-owner', 0) : id('member', index - 1),
    role: DepartmentMemberRole.MANAGER,
    jobTitle: JobTitle.SENIOR,
    assignedAt: daysAgo(index),
  }));
  const additionalDepartmentMembers = Array.from(
    { length: COUNT * 2 },
    (_, index) => ({
      id: id('department-member-extra', index),
      departmentId: id('department', index % COUNT),
      demoMemberId: id('member', (index + 3) % COUNT),
      role: DepartmentMemberRole.MEMBER,
      jobTitle: [JobTitle.INTERN, JobTitle.JUNIOR, JobTitle.SENIOR][index % 3],
      assignedAt: daysAgo(index % COUNT),
    }),
  ).filter(
    (candidate) =>
      !departmentMembers.some(
        (manager) =>
          manager.departmentId === candidate.departmentId &&
          manager.demoMemberId === candidate.demoMemberId,
      ),
  );
  await prisma.departmentMember.createMany({
    data: [...departmentMembers, ...additionalDepartmentMembers],
    skipDuplicates: true,
  });

  await prisma.tag.createMany({
    data: Array.from({ length: COUNT }, (_, index) => ({
      id: id('tag', index),
      name: `Seed Tag ${index + 1}`,
    })),
  });

  for (let index = 0; index < COUNT; index++) {
    await prisma.course.create({
      data: {
        id: id('course', index),
        title: `Seed Course ${index + 1}`,
        imagePath: `https://placehold.co/600x400?text=Course${index + 1}`,
        signatureImagePath: 'https://placehold.co/800x200?text=CourseSignature',
        description: `Complete seeded course ${index + 1}`,
        visibility:
          index % 2 ? CourseVisibility.PRIVATE : CourseVisibility.PUBLIC,
        price: index % 3 === 0 ? 0 : 49 + index * 5,
        isPublished: index < 12,
        demoId: id('demo', 0),
        createdAt: daysAgo(COUNT - index),
        tags: {
          connect: [
            { id: id('tag', index) },
            { id: id('tag', (index + 1) % COUNT) },
          ],
        },
      },
    });
  }

  await prisma.courseFaq.createMany({
    data: Array.from({ length: COUNT * 2 }, (_, index) => ({
      id: id('faq', index),
      question: `Frequently asked question ${index + 1}?`,
      answer: `Seeded answer for question ${index + 1}.`,
      courseId: id('course', index % COUNT),
    })),
  });

  const sections = Array.from({ length: COUNT * 2 }, (_, index) => ({
    id: id('section', index),
    title: index % 2 === 0 ? 'Core Concepts' : 'Applied Practice',
    order: (index % 2) + 1,
    courseId: id('course', Math.floor(index / 2)),
  }));
  await prisma.section.createMany({ data: sections });

  const lessons = Array.from({ length: sections.length * 3 }, (_, index) => ({
    id: id('lesson', index),
    title: `Seed Lesson ${index + 1}`,
    description: `Detailed lesson content ${index + 1}`,
    videoUrl: `https://example.com/videos/lesson-${index + 1}.mp4`,
    subTitleUrl: `https://example.com/subtitles/lesson-${index + 1}.vtt`,
    duration: 600 + (index % 6) * 180,
    order: (index % 3) + 1,
    sectionId: id('section', Math.floor(index / 3)),
  }));
  await prisma.lesson.createMany({ data: lessons });

  await prisma.attachment.createMany({
    data: Array.from({ length: COUNT * 2 }, (_, index) => ({
      id: id('attachment', index),
      name: `lesson-resource-${index + 1}.pdf`,
      path: `https://example.com/resources/${index + 1}.pdf`,
      mimeType: 'application/pdf',
      lessonId: id('lesson', index % lessons.length),
    })),
  });

  await prisma.exam.createMany({
    data: sections.map((section, index) => ({
      id: id('exam', index),
      sectionId: section.id,
      title: `Assessment ${index + 1}`,
      passingScore: 70,
      numberOfQuestions: 4,
      durationMinutes: 30,
    })),
  });

  const questions = Array.from({ length: sections.length * 4 }, (_, index) => ({
    id: id('question', index),
    sectionId: id('section', Math.floor(index / 4)),
    question: `Seed question ${index + 1}?`,
    note: `Explanation for question ${index + 1}`,
  }));
  await prisma.questionsBank.createMany({ data: questions });
  await prisma.questionChoice.createMany({
    data: questions.flatMap((question, questionIndex) =>
      Array.from({ length: 4 }, (_, choiceIndex) => ({
        id: id('choice', questionIndex * 4 + choiceIndex),
        questionId: question.id,
        choice: `Choice ${choiceIndex + 1} for question ${questionIndex + 1}`,
        isCorrect: choiceIndex === 0,
      })),
    ),
  });

  await prisma.asset.createMany({
    data: Array.from({ length: COUNT }, (_, index) => ({
      id: id('asset', index),
      demoId: id('demo', 0),
      courseId: id('course', index),
      accessMethod: index % 3 ? AccessMethod.CREATED : AccessMethod.PURCHASED,
    })),
  });
  await prisma.departmentCourse.createMany({
    data: Array.from({ length: COUNT * 2 }, (_, index) => ({
      id: id('department-course', index),
      departmentId: id('department', index % COUNT),
      assetId: id('asset', index % COUNT),
    })),
    skipDuplicates: true,
  });

  await prisma.examAttempt.createMany({
    data: Array.from({ length: COUNT * 4 }, (_, index) => ({
      id: id('attempt', index),
      demoMemberId: id('member', index % COUNT),
      examId: id('exam', index % sections.length),
      score: 45 + ((index * 11) % 56),
      createdAt: daysAgo(index % 30),
    })),
  });
  await prisma.certification.createMany({
    data: Array.from({ length: COUNT }, (_, index) => ({
      id: id('certification', index),
      demoMemberId: id('member', index),
      courseId: id('course', index),
      score: 75 + (index % 6) * 4,
      issuedAt: daysAgo(index),
    })),
  });

  const discussionQuestions = Array.from({ length: COUNT * 3 }, (_, index) => ({
    id: id('discussion-question', index),
    lessonId: id('lesson', index % lessons.length),
    demoMemberId: id('member', index % COUNT),
    content: `Can someone explain the concept in seeded lesson ${index + 1}?`,
    createdAt: daysAgo(index % 20),
  }));
  await prisma.discussionQuestion.createMany({ data: discussionQuestions });
  await prisma.discussionAnswer.createMany({
    data: Array.from({ length: COUNT * 4 }, (_, index) => ({
      id: id('discussion-answer', index),
      discussionId: id(
        'discussion-question',
        index % discussionQuestions.length,
      ),
      demoMemberId: id('member', (index + 1) % COUNT),
      content: `Seeded helpful answer ${index + 1}.`,
      createdAt: daysAgo(index % 15),
    })),
  });

  const inquiries = Array.from({ length: COUNT }, (_, index) => ({
    id: id('inquiry', index),
    subject: `Seed support inquiry ${index + 1}`,
    message: `Please help with seeded inquiry ${index + 1}.`,
    creatorId: id('member', index),
    demoId: id('demo', 0),
    status: index % 3 === 0 ? ('RESOLVED' as const) : ('PENDING' as const),
  }));
  await prisma.inquiry.createMany({ data: inquiries });
  await prisma.inquiryReply.createMany({
    data: inquiries.slice(0, 10).map((inquiry, index) => ({
      id: id('inquiry-reply', index),
      inquiryId: inquiry.id,
      senderType: InquirySenderType.OWNER,
      senderId: id('member-owner', 0),
      message: `Owner response to inquiry ${index + 1}.`,
    })),
  });

  const storedDepartmentMembers = await prisma.departmentMember.findMany({
    where: { id: { startsWith: 'seed-' } },
    orderBy: { id: 'asc' },
  });
  await prisma.departmentMessage.createMany({
    data: Array.from({ length: COUNT * 4 }, (_, index) => {
      const sender =
        storedDepartmentMembers[index % storedDepartmentMembers.length];
      return {
        id: id('message', index),
        departmentId: sender.departmentId,
        senderId: sender.id,
        type: MessageType.TEXT,
        content: `Seed department message ${index + 1}`,
        isEdited: index % 10 === 0,
        createdAt: daysAgo(index % 10),
      };
    }),
  });

  await prisma.liveStream.createMany({
    data: Array.from({ length: COUNT * 2 }, (_, index) => {
      const host = departmentMembers[index % departmentMembers.length];
      const status = [
        LiveStreamStatus.SCHEDULED,
        LiveStreamStatus.LIVE,
        LiveStreamStatus.ENDED,
      ][index % 3];
      return {
        id: id('live-stream', index),
        title: `Seed Live Session ${index + 1}`,
        description: `Interactive seeded session ${index + 1}`,
        status,
        roomName: `seed-room-${index + 1}`,
        departmentId: host.departmentId,
        hostId: host.id,
        scheduledAt: daysAgo(index % 10),
        startedAt:
          status === LiveStreamStatus.SCHEDULED ? null : daysAgo(index % 10),
        endedAt: status === LiveStreamStatus.ENDED ? daysAgo(index % 10) : null,
      };
    }),
  });

  await prisma.payment.createMany({
    data: Array.from({ length: COUNT * 2 }, (_, index) => ({
      id: id('payment', index),
      amount: 4900 + index * 100,
      currency: 'USD',
      type: index % 2 ? PaymentType.COURSE : PaymentType.SUBSCRIPTION,
      plan: index % 2 ? null : PlanTier.PRO,
      status: [
        PaymentStatus.SUCCESSFUL,
        PaymentStatus.PENDING,
        PaymentStatus.FAILED,
      ][index % 3],
      userId: id('user', index % (COUNT * 2)),
      demoId: id('demo', index % COUNT),
      courseId: index % 2 ? id('course', index % COUNT) : null,
      createdAt: daysAgo(index),
    })),
  });
  await prisma.fcmToken.createMany({
    data: Array.from({ length: COUNT }, (_, index) => ({
      id: id('fcm-token', index),
      token: `seed-device-token-${index + 1}`,
      deviceModel: index % 2 ? 'Android Seed Device' : 'iOS Seed Device',
      userId: id('user', index),
    })),
  });

  console.log('Seed completed.');
  console.log('Owner: seed.user1@example.com / Seed@2026');
  console.log(`Primary demo ID: ${id('demo', 0)}`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
