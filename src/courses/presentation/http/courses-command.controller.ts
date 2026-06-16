import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { CourseResponseMapper } from './mappers/course-response.mapper';
import { CoursesCommandService } from 'src/courses/application/courses-command.service';

@Controller('demos/:demoId/courses')
export class CoursesCommandController {
  constructor(
    private readonly courseCommandService: CoursesCommandService,
    private readonly courseResponseMapper: CourseResponseMapper,
  ) {}

  @Post()
  async create(@Param('demoId') demoId: string, @Body() dto: CreateCourseDto) {
    const course = await this.courseCommandService.create(demoId, dto);

    return {
      message: 'Course created successfully',
      data: this.courseResponseMapper.toResponseFromDomain(course),
    };
  }

  @Patch('courseId')
  async update(
    @Param('demoId') demoId: string,
    @Param('courseId') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    const course = await this.courseCommandService.update(
      demoId,
      courseId,
      dto,
    );

    return {
      message: 'Course updated successfully',
      data: this.courseResponseMapper.toResponseFromDomain(course),
    };
  }

  @Delete(':courseId')
  async remove(
    @Param('demoId') demoId: string,
    @Param('courseId') courseId: string,
  ) {
    await this.courseCommandService.remove(demoId, courseId);

    return {
      message: 'Course deleted successfully',
      data: null,
    };
  }
}
