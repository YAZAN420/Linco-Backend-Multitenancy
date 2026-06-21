import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ExamAttemptQueryService } from 'src/exams/application/exams-attempts-query.service';
import { ExamRandomResponseMapper } from './mappers/random-exam-response.mapper';
import { FindExamsDto } from './dto/filters/find-exams.dto';
import { ExamAttemptResponseMapper } from './mappers/exam-attempt-response.mapper';
import { FindExamsCursorDto } from './dto/filters/find-exams-cursor.dto';

@Controller('examAttempts')
export class ExamsAttemptQueryController {
  constructor(
    private readonly examAttemptQueryService: ExamAttemptQueryService,
    private readonly examAttemptResponseMapper: ExamAttemptResponseMapper,
    private readonly examRandomResponseMapper: ExamRandomResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Param("sectionId") sectionId: string,
    @Query() options: FindExamsDto
  ) {
    const exams = await this.examAttemptQueryService.findAll(sectionId, options);
    return {
      message: 'Exams fetched successfully',
      data: this.examAttemptResponseMapper.toResponseManyFromPrisma(exams.data),
      meta: exams.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(
    @Param("courseId") courseId: string,
    @Query() options: FindExamsCursorDto
    ) {
    const exams = await this.examAttemptQueryService.findAllCursor(courseId, options);

    return {
      message: 'Exams fetched successfully (Cursor)',
      data: this.examAttemptResponseMapper.toResponseManyFromPrisma(exams.data),
      meta: exams.meta,
    };
  }

  @Get(':examAttemptId')
  async findOne(
    @Param('examAttemptId') examAttemptId: string,
  ) {
    const exam = await this.examAttemptQueryService.findById(examAttemptId);

    return {
      message: 'Exam retrieved successfully',
      data: this.examAttemptResponseMapper.toResponseFromPrisma(exam),
    };
  }

  @Get(':examAttemptId')
  async generateExam(
    @Param('examAttemptId') examAttemptId: string,
  ) {
    const exam = await this.examAttemptQueryService.generateExam(examAttemptId);

    return {
      message: 'Exam retrieved successfully',
      data: this.examRandomResponseMapper.toResponseFromDomain(exam),
    };
  }
}