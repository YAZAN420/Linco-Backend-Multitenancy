import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { CourseResponseMapper } from './mappers/course-response.mapper';
import { CoursesCommandService } from 'src/courses/application/courses-command.service';
import { GenerateUploadUrlDto } from 'src/common/dtos/generate-upload-url.dto';

@Controller('courses')
export class CoursesCommandController {
  constructor(
    private readonly courseCommandService: CoursesCommandService,
    private readonly courseResponseMapper: CourseResponseMapper,
  ) {}

  @Post('upload-url')
  async getUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return await this.courseCommandService.generateDemoImageUploadUrl(
      dto.fileName,
    );
  }

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    const course = await this.courseCommandService.create(dto);

    return {
      message: 'Course created successfully',
      data: this.courseResponseMapper.toResponseFromDomain(course),
    };
  }

  @Patch(':courseId')
  async update(
    @Param('courseId') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    const course = await this.courseCommandService.update(courseId, dto);

    return {
      message: 'Course updated successfully',
      data: this.courseResponseMapper.toResponseFromDomain(course),
    };
  }

  @Delete(':courseId')
  async remove(@Param('courseId') courseId: string) {
    await this.courseCommandService.remove(courseId);

    return {
      message: 'Course deleted successfully',
      data: null,
    };
  }
}
