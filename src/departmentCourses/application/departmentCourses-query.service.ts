import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindDepartmentCoursesCursorQuery,
  FindDepartmentCoursesQuery,
} from './interfaces/find-departmentCourses.query';
import { DepartmentCourseQueryRepository } from './ports/departmentCourse-query.repository';
import { DemoQueryRepository } from 'src/demos/application/ports/demo/demo-query.repository';
import { DepartmentCourseWithAssetWithCourse } from 'src/core/database/prisma/types';

@Injectable()
export class DepartmentCoursesQueryService {
  constructor(
    private readonly departmentCourseQueryRepository: DepartmentCourseQueryRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
  ) {}

  async findAll(
    departmentId: string,
    pageOptionsDto: FindDepartmentCoursesQuery,
  ): Promise<PageDto<DepartmentCourseWithAssetWithCourse>> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    }
    return this.departmentCourseQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    departmentId: string,
    options: FindDepartmentCoursesCursorQuery,
  ): Promise<CursorPageDto<DepartmentCourseWithAssetWithCourse>> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    }
    return this.departmentCourseQueryRepository.findAllCursor(options);
  }

  async findById(
    departmentId: string,
    id: string,
  ): Promise<DepartmentCourseWithAssetWithCourse> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
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
