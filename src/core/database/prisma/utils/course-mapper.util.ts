import { Prisma } from 'src/generated/prisma/client';
import {
  CourseWithStats,
  AssetWithCourse,
  DepartmentCourseWithAssetWithCourse,
} from 'src/core/database/prisma/types';

export const courseWithStatsInclude = {
  demo: true,
  tags: true,
  _count: {
    select: { sections: true },
  },
  sections: {
    select: {
      _count: { select: { lessons: true } },
      lessons: { select: { duration: true } },
    },
  },
} as const satisfies Prisma.CourseInclude;

type RawCourseFromDb = Prisma.CourseGetPayload<{
  include: typeof courseWithStatsInclude;
}>;
type RawAssetFromDb = Prisma.AssetGetPayload<{
  include: { course: { include: typeof courseWithStatsInclude } };
}>;
type RawDepartmentCourseFromDb = Prisma.DepartmentCourseGetPayload<{
  include: {
    asset: { include: { course: { include: typeof courseWithStatsInclude } } };
  };
}>;

export function mapCourseToCourseWithStats(
  rawCourse: RawCourseFromDb,
): CourseWithStats {
  let totalLessons = 0;
  let totalDuration = 0;

  rawCourse.sections.forEach((section) => {
    totalLessons += section._count.lessons;
    section.lessons.forEach((lesson) => {
      totalDuration += lesson.duration;
    });
  });

  const { sections: _sections, ...courseData } = rawCourse;

  return {
    ...courseData,
    totalLessons,
    totalDuration,
  } as CourseWithStats;
}

export function mapAssetWithCourse(rawAsset: RawAssetFromDb): AssetWithCourse {
  const { course, ...assetData } = rawAsset;

  return {
    ...assetData,
    course: mapCourseToCourseWithStats(course),
  } as AssetWithCourse;
}

export function mapDepartmentCourse(
  rawDeptCourse: RawDepartmentCourseFromDb,
): DepartmentCourseWithAssetWithCourse {
  const { asset, ...deptCourseData } = rawDeptCourse;

  return {
    ...deptCourseData,
    asset: mapAssetWithCourse(asset),
  } as DepartmentCourseWithAssetWithCourse;
}
