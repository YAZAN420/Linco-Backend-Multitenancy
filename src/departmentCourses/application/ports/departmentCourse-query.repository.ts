import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindDepartmentCoursesCursorQuery,
  FindDepartmentCoursesQuery,
} from '../interfaces/find-departmentCourses.query';
import { DepartmentCourseWithAssetWithCourse } from 'src/core/database/prisma/types';

export abstract class DepartmentCourseQueryRepository {
  abstract findAll(
    options: FindDepartmentCoursesQuery,
  ): Promise<PageDto<DepartmentCourseWithAssetWithCourse>>;
  abstract findAllCursor(
    options: FindDepartmentCoursesCursorQuery,
  ): Promise<CursorPageDto<DepartmentCourseWithAssetWithCourse>>;
  abstract findById(
    id: string,
  ): Promise<DepartmentCourseWithAssetWithCourse | null>;
}
