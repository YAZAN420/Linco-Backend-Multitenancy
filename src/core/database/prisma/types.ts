import { Prisma } from 'src/generated/prisma/client';

export type LessonWithAttachments = Prisma.LessonGetPayload<{
  include: { attachments: true };
}>;

export type CourseWithSections = Prisma.CourseGetPayload<{
  include: { sections: true };
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

export type AssetWithCourse = Prisma.AssetGetPayload<{
  include: {
    course: {
      include: {
        demo: true;
      };
    };
  };
}>;

export type DepartmentCourseWithAssetWithCourse =
  Prisma.DepartmentCourseGetPayload<{
    include: {
      asset: {
        include: {
          course: {
            include: {
              demo: true;
            };
          };
        };
      };
    };
  }>;

export type CourseWithDemo = Prisma.CourseGetPayload<{
  include: {
    demo: true;
  };
}>;

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
