import { Prisma } from 'src/generated/prisma/client';

export type LessonWithAttachments = Prisma.LessonGetPayload<{
  include: { attachments: true };
}>;

export type CourseWithSections = Prisma.CourseGetPayload<{
  include: { sections: true };
}>;

export type DemoWithDepartments = Prisma.DemoGetPayload<{
  include: { departments: true };
}>;

export type DemoMemberWithUser = Prisma.DemoMemberGetPayload<{
  include: { user: true };
}>;

export type AssetWithCourse = Prisma.AssetGetPayload<{
  include: { course: true };
}>;

export type DepartmentCourseWithAssetWithCourse =
  Prisma.DepartmentCourseGetPayload<{
    include: {
      asset: {
        include: { course: true };
      };
    };
  }>;
