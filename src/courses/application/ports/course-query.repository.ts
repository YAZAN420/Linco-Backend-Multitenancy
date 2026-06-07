import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from '../interfaces/find-courses.query';
import { Course } from 'src/generated/prisma/browser';

export abstract class CourseQueryRepository {
  abstract findAll(options: FindCoursesQuery): Promise<PageDto<Course>>;
  abstract findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<Course>>;
  abstract findById(id: string): Promise<Course | null>;
}
