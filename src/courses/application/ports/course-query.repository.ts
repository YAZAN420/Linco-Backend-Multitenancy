import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from '../interfaces/find-courses.query';
import { Course, Section } from 'src/generated/prisma/client';
import { FindSectionsCursorQuery } from '../interfaces/find-sections.query';

export abstract class CourseQueryRepository {
  abstract findAll(options: FindCoursesQuery): Promise<PageDto<Course>>;
  abstract findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<Course>>;
  abstract findById(id: string): Promise<Course | null>;
  abstract findSectionsCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>>;
  abstract findSectionById(sectionId: string): Promise<Section | null>;
}
