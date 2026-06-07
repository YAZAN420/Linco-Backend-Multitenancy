import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { CourseResponseMapper } from './mappers/course-response.mapper';
import { CoursesCommandService } from 'src/courses/application/courses-command.service';

@Controller('courses')
export class CoursesCommandController {
  constructor(
    private readonly courseCommandService: CoursesCommandService,
    private readonly courseResponseMapper: CourseResponseMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    const course = await this.courseCommandService.create(dto);

    return {
      message: 'Course created successfully',
      data: this.courseResponseMapper.toResponseFromDomain(course),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    const course = await this.courseCommandService.update(id, dto);

    return {
      message: 'Course updated successfully',
      data: this.courseResponseMapper.toResponseFromDomain(course),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.courseCommandService.remove(id);

    return {
      message: 'Course deleted successfully',
      data: null,
    };
  }
}
