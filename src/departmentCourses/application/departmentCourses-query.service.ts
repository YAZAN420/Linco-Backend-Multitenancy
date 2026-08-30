import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindDepartmentCoursesCursorQuery } from './interfaces/find-departmentCourses.query';
import { DepartmentCourseQueryRepository } from './ports/departmentCourse-query.repository';
import { DepartmentsQueryService } from 'src/demos/application/department/departments-query.service';
import { DepartmentCourseWithAssetWithCourse } from 'src/core/database/prisma/types';

@Injectable()
export class DepartmentCoursesQueryService {
  constructor(
    private readonly departmentCourseQueryRepository: DepartmentCourseQueryRepository,
    private readonly departmentsQueryService: DepartmentsQueryService,
  ) {}

  async findAllCursor(
    departmentId: string,
    options: FindDepartmentCoursesCursorQuery,
  ): Promise<CursorPageDto<DepartmentCourseWithAssetWithCourse>> {
    const department =
      await this.departmentsQueryService.findDepartmentByIdInternal(
        departmentId,
      );
    if (!department) {
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    }
    return this.departmentCourseQueryRepository.findAllCursor(
      departmentId,
      options,
    );
  }

  async findById(
    departmentId: string,
    id: string,
  ): Promise<DepartmentCourseWithAssetWithCourse> {
    const department =
      await this.departmentsQueryService.findDepartmentByIdInternal(
        departmentId,
      );
    if (!department) {
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    }
    const departmentCourse =
      await this.departmentCourseQueryRepository.findById(id);
    if (!departmentCourse)
      throw new NotFoundException('errors.DEPARTMENT_COURSE_NOT_FOUND');
    return departmentCourse;
  }
}
