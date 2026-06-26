import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from '../interfaces/find-courses.query';
import { Section } from 'src/generated/prisma/client';
import { FindSectionsCursorQuery } from '../interfaces/find-sections.query';
import { CourseWithDemo } from 'src/core/database/prisma/types';

export abstract class CourseQueryRepository {
  abstract findAll(options: FindCoursesQuery): Promise<PageDto<CourseWithDemo>>;
  abstract findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<CourseWithDemo>>;
  abstract findById(id: string): Promise<CourseWithDemo | null>;
  abstract findSectionsCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>>;
  abstract findSectionById(sectionId: string): Promise<Section | null>;
}
