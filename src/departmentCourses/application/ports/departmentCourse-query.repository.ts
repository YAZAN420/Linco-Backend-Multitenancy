import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindDepartmentCoursesCursorQuery,
  FindDepartmentCoursesQuery,
} from '../interfaces/find-departmentCourses.query';
import { DepartmentCourse } from 'src/generated/prisma/client';

export abstract class DepartmentCourseQueryRepository {
  abstract findAll(options: FindDepartmentCoursesQuery): Promise<PageDto<DepartmentCourse>>;
  abstract findAllCursor(
    options: FindDepartmentCoursesCursorQuery,
  ): Promise<CursorPageDto<DepartmentCourse>>;
  abstract findById(id: string): Promise<DepartmentCourse | null>;
}
