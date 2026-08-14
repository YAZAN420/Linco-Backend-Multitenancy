import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from '../interfaces/find-courses.query';
import { Section } from 'src/generated/prisma/client';
import { FindSectionsCursorQuery } from '../interfaces/find-sections.query';
import {
  CourseWithStats,
  SectionWithExamAndQuestionCount,
} from 'src/core/database/prisma/types';
import { CourseDashboardStats } from '../interfaces/course-dashboard-stats.interface';

export abstract class CourseQueryRepository {
  abstract findAll(
    options: FindCoursesQuery,
  ): Promise<PageDto<CourseWithStats>>;
  abstract findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<CourseWithStats>>;
  abstract findById(
    id: string,
    checkVisibility?: boolean,
  ): Promise<CourseWithStats | null>;
  abstract findSectionsCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>>;
  abstract findSectionById(sectionId: string): Promise<Section | null>;
  abstract findSectionWithExamAndQuestionCount(
    sectionId: string,
  ): Promise<SectionWithExamAndQuestionCount | null>;
  abstract getDashboardStats(): Promise<CourseDashboardStats>;
}
