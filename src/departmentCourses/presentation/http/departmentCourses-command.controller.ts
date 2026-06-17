import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateDepartmentCourseDto } from './dto/create-departmentCourse.dto';
import { UpdateDepartmentCourseDto } from './dto/update-departmentCourse.dto';

import { DepartmentCourseResponseMapper } from './mappers/departmentCourse-response.mapper';
import { DepartmentCoursesCommandService } from 'src/departmentCourses/application/departmentCourses-command.service';

@Controller('departmentCourses')
export class DepartmentCoursesCommandController {
  constructor(
    private readonly departmentCourseCommandService: DepartmentCoursesCommandService,
    private readonly departmentCourseResponseMapper: DepartmentCourseResponseMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateDepartmentCourseDto) {
    const departmentCourse =
      await this.departmentCourseCommandService.create(dto);

    return {
      message: 'DepartmentCourse created successfully',
      data: this.departmentCourseResponseMapper.toResponseFromDomain(
        departmentCourse,
      ),
    };
  }

  @Patch(':departmentCourseId')
  async update(
    @Param('departmentCourseId') departmentCourseId: string,
    @Body() dto: UpdateDepartmentCourseDto,
  ) {
    const departmentCourse = await this.departmentCourseCommandService.update(
      departmentCourseId,
      dto,
    );

    return {
      message: 'DepartmentCourse updated successfully',
      data: this.departmentCourseResponseMapper.toResponseFromDomain(
        departmentCourse,
      ),
    };
  }

  @Delete(':departmentCourseId')
  async remove(@Param('departmentCourseId') departmentCourseId: string) {
    await this.departmentCourseCommandService.remove(departmentCourseId);

    return {
      message: 'DepartmentCourse deleted successfully',
      data: null,
    };
  }
}
