import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { ExamAttemptQueryService } from 'src/exams/application/exams-attempts-query.service';
import { ExamRandomResponseMapper } from './mappers/random-exam-response.mapper';
import { ExamAttemptResponseMapper } from './mappers/exam-attempt-response.mapper';
import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ExamAttempts')
@Controller()
export class ExamsAttemptQueryController {
  constructor(
    private readonly examAttemptQueryService: ExamAttemptQueryService,
    private readonly examAttemptResponseMapper: ExamAttemptResponseMapper,
    private readonly examRandomResponseMapper: ExamRandomResponseMapper,
  ) {}

  @Get('/section/:sectionId/examAttempts')
  async findAll(
    @Param('sectionId') sectionId: string,
    @Query() options: PageOptionsDto,
  ) {
    const exams = await this.examAttemptQueryService.findAll(
      sectionId,
      options,
    );
    return {
      message: 'Exams fetched successfully',
      data: this.examAttemptResponseMapper.toResponseManyFromPrisma(exams.data),
      meta: exams.meta,
    };
  }

  @Get('/course/:courseId/examAttempts/cursor')
  async findWithCursor(
    @Param('courseId') courseId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const exams = await this.examAttemptQueryService.findAllCursor(
      courseId,
      options,
    );

    return {
      message: 'Exams fetched successfully ',
      data: this.examAttemptResponseMapper.toResponseManyFromPrisma(exams.data),
      meta: exams.meta,
    };
  }

  @Get('/examAttempts/:examAttemptId')
  async findOne(@Param('examAttemptId') examAttemptId: string) {
    const exam = await this.examAttemptQueryService.findById(examAttemptId);

    return {
      message: 'Exam retrieved successfully',
      data: this.examAttemptResponseMapper.toResponseFromPrisma(exam),
    };
  }

  @Get('/generateExam/:examAttemptId')
  async generateExam(@Param('examAttemptId') examAttemptId: string) {
    const exam = await this.examAttemptQueryService.generateExam(examAttemptId);

    return {
      message: 'Exam retrieved successfully',
      data: this.examRandomResponseMapper.toResponseFromDomain(exam),
    };
  }
}
