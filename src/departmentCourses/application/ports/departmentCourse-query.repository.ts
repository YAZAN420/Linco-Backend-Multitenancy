import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindDepartmentCoursesCursorQuery,
  FindDepartmentCoursesQuery,
} from '../interfaces/find-departmentCourses.query';
import { DepartmentCourseWithAssetWithCourse } from 'src/core/database/prisma/types';

export abstract class DepartmentCourseQueryRepository {
  abstract findAllCursor(
    departmentId: string,
    options: FindDepartmentCoursesCursorQuery,
  ): Promise<CursorPageDto<DepartmentCourseWithAssetWithCourse>>;
  abstract findById(
    id: string,
  ): Promise<DepartmentCourseWithAssetWithCourse | null>;
}
