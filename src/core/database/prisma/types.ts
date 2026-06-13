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
