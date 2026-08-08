import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { DepartmentCoursesQueryService } from 'src/departmentCourses/application/departmentCourses-query.service';

import { DepartmentCourseResponseMapper } from './mappers/departmentCourse-response.mapper';
import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { DepartmentRolesGuard } from 'src/iam/presentation/http/guards/department-roles.guard';

import { ActiveDepartmentMember } from 'src/iam/presentation/http/decorators/active-department-member.decorator';

@ApiTags('DepartmentCourse')
@UseGuards(DemoRolesGuard, DepartmentRolesGuard)
@Controller('departmentCourses')
export class DepartmentCoursesQueryController {
  constructor(
    private readonly departmentCourseQueryService: DepartmentCoursesQueryService,
    private readonly departmentCourseResponseMapper: DepartmentCourseResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const departmentCourses =
      await this.departmentCourseQueryService.findAllCursor(
        departmentId,
        options,
      );

    return {
      message: 'messages.DEPARTMENT_COURSES_FETCHED_SUCCESSFULLY',
      data: this.departmentCourseResponseMapper.toResponseManyFromPrisma(
        departmentCourses.data,
      ),
      meta: departmentCourses.meta,
    };
  }

  @Get(':departmentCourseId')
  async findOne(
    @ActiveDepartmentMember('departmentId') departmentId: string,
    @Param('departmentCourseId') departmentCourseId: string,
  ) {
    const departmentCourse = await this.departmentCourseQueryService.findById(
      departmentId,
      departmentCourseId,
    );

    return {
      message: 'messages.DEPARTMENT_COURSE_ADDED_SUCCESSFULLY',
      data: this.departmentCourseResponseMapper.toResponseFromPrisma(
        departmentCourse,
      ),
    };
  }
}
