import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from '../interfaces/find-courses.query';
import { CourseWithStats } from 'src/core/database/prisma/types';
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
  abstract getDashboardStats(): Promise<CourseDashboardStats>;
}
