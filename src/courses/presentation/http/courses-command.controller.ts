import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

import { CourseResponseMapper } from './mappers/course-response.mapper';
import { CoursesCommandService } from 'src/courses/application/courses-command.service';
import { GenerateUploadUrlDto } from 'src/common/dtos/generate-upload-url.dto';
import { CoursesQueryService } from 'src/courses/application/courses-query.service';
import { CreateCourseQuizDto } from './dto/create-course-quiz.dto';
import { CreateCourseRandomQuizDto } from './dto/create-course-random-quiz.dto';

@Controller('courses')
export class CoursesCommandController {
  constructor(
    private readonly courseCommandService: CoursesCommandService,
    private readonly courseQueryService: CoursesQueryService,
    private readonly courseResponseMapper: CourseResponseMapper,
  ) {}

  @Post('upload-url')
  async getUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return await this.courseCommandService.generateDemoImageUploadUrl(
      dto.fileName,
    );
  }

  @Post(':courseId/publish')
  async publish(@Param('courseId') courseId: string) {
    const publishedCourse = await this.courseCommandService.publish(courseId);
    const course = await this.courseQueryService.findById(
      publishedCourse.id,
      false,
    );
    return {
      message: 'Course published successfully',
      data: this.courseResponseMapper.toResponseFromPrisma(course),
    };
  }

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    const createdCourse = await this.courseCommandService.create(dto);
    const course = await this.courseQueryService.findById(
      createdCourse.id,
      false,
    );
    return {
      message: 'Course created successfully',
      data: this.courseResponseMapper.toResponseFromPrisma(course),
    };
  }

  @Patch(':courseId')
  async update(
    @Param('courseId') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    const updatedCourse = await this.courseCommandService.update(courseId, dto);
    const course = await this.courseQueryService.findById(
      updatedCourse.id,
      false,
    );
    return {
      message: 'Course updated successfully',
      data: this.courseResponseMapper.toResponseFromPrisma(course),
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

  @Post(':id/ask')
  async askQuestion(
    @Param('id') courseId: string,
    @Body('question') question: string,
  ) {
    const data = await this.courseCommandService.askQuestionAboutCourse(
      courseId,
      question,
    );
    return {
      message: 'Question asked successfully',
      data: data.answer,
    };
  }

  @Post(':id/quiz/generate')
  async generateQuiz(
    @Param('id') courseId: string,
    @Body() dto: CreateCourseQuizDto,
  ) {
    const data = await this.courseCommandService.generateQuizForCourse(
      courseId,
      dto,
    );
    return {
      message: 'Quiz generated successfully',
      data: data.quiz,
    };
  }

  @Post(':id/random-quiz/generate')
  async generateRandomQuiz(
    @Param('id') courseId: string,
    @Body() dto: CreateCourseRandomQuizDto,
  ) {
    const data = await this.courseCommandService.generateRandomQuizForCourse(
      courseId,
      dto.questionCount,
    );
    return {
      message: ' Random quiz generated successfully',
      data: data.quiz,
    };
  }
}
