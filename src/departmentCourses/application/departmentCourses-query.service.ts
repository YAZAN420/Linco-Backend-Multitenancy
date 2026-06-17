import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import {
  FindDepartmentCoursesCursorQuery,
  FindDepartmentCoursesQuery,
} from './interfaces/find-departmentCourses.query';
import { DepartmentCourse } from 'src/generated/prisma/client';
import { DepartmentCourseQueryRepository } from './ports/departmentCourse-query.repository';

@Injectable()
export class DepartmentCoursesQueryService {
  constructor(private readonly departmentCourseQueryRepository: DepartmentCourseQueryRepository) {}

  async findAll(pageOptionsDto: FindDepartmentCoursesQuery): Promise<PageDto<DepartmentCourse>> {
    return this.departmentCourseQueryRepository.findAll(pageOptionsDto);
  }

  async findAllCursor(
    options: FindDepartmentCoursesCursorQuery,
  ): Promise<CursorPageDto<DepartmentCourse>> {
    return this.departmentCourseQueryRepository.findAllCursor(options);
  }

  async findById(id: string): Promise<DepartmentCourse> {
    const departmentCourse = await this.departmentCourseQueryRepository.findById(id);
    if (!departmentCourse) throw new NotFoundException('DepartmentCourse not found');
    return departmentCourse;
  }
}
