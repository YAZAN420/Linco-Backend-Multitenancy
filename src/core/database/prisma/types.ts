import { Prisma } from 'src/generated/prisma/client';

export type LessonWithAttachments = Prisma.LessonGetPayload<{
  include: { attachments: true };
}>;

export type CourseWithSections = Prisma.CourseGetPayload<{
  include: { sections: true; tags: true };
}>;

export type QuestionsBankWithQuestionChoices = Prisma.QuestionsBankGetPayload<{
  include: { choices: true };
}>;

export type DemoWithDepartments = Prisma.DemoGetPayload<{
  include: { departments: true };
}>;

export type DemoMemberWithUser = Prisma.DemoMemberGetPayload<{
  include: { user: true };
}>;

export type DemoWithMemberCount = Prisma.DemoGetPayload<{
  include: {
    _count: { select: { members: true } };
    owner: { select: { firstName: true; lastName: true } };
  };
}>;

export type DemoWithOwnership = DemoWithMemberCount & { isOwner: boolean };

export type CourseWithDemo = Prisma.CourseGetPayload<{
  include: {
    demo: true;
    tags: true;
  };
}>;

export type AssetWithCourse = Prisma.AssetGetPayload<{
  include: {
    course: true;
  };
}> & {
  course: CourseWithDemo;
};

export type DepartmentCourseWithAssetWithCourse =
  Prisma.DepartmentCourseGetPayload<{
    include: {
      asset: true;
    };
  }> & {
    asset: AssetWithCourse;
  };

export type CourseWithStats = CourseWithDemo & {
  _count?: {
    sections: number;
  };
  totalLessons: number;
  totalDuration: number;
};

export type DepartmentWithCounts = Prisma.DepartmentGetPayload<{
  include: {
    _count: { select: { members: true; courses: true } };
  };
}>;

export type DepartmentWithDetails = DepartmentWithCounts & {
  isJoined: boolean;
};

export type DepartmentMemberWithUser = Prisma.DepartmentMemberGetPayload<{
  include: {
    demoMember: {
      include: {
        user: true;
      };
    };
  };
}>;

export type InvitationWithUserAndDemo = Prisma.InvitationGetPayload<{
  include: {
    sender: true;
    demo: true;
  };
}>;
