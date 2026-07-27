import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExamAttemptQueryService } from 'src/exams/application/exams-attempts-query.service';
import { ExamAttemptResponseMapper } from './mappers/exam-attempt-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { ApiTags } from '@nestjs/swagger';
import { ExamResponseMapper } from './mappers/exam-response.mapper';

@ApiTags('ExamAttempts')
@Controller('examAttempts')
export class ExamsAttemptQueryController {
  constructor(
    private readonly examAttemptQueryService: ExamAttemptQueryService,
    private readonly examAttemptResponseMapper: ExamAttemptResponseMapper,
    private readonly examResponseMapper: ExamResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(@Query() options: CursorPageOptionsDto) {
    const exams = await this.examAttemptQueryService.findAllCursor(options);

    return {
      message: 'Exams fetched successfully ',
      data: this.examAttemptResponseMapper.toResponseManyFromPrisma(exams.data),
      meta: exams.meta,
    };
  }

  @Get(':examAttemptId')
  async findOne(@Param('examAttemptId') examAttemptId: string) {
    const exam = await this.examAttemptQueryService.findById(examAttemptId);

    return {
      message: 'Exam retrieved successfully',
      data: this.examAttemptResponseMapper.toResponseFromPrisma(exam),
    };
  }

  @Get('generate/:examId')
  async generateExam(@Param('examId') examId: string) {
    const exam = await this.examAttemptQueryService.generateExam(examId);

    return {
      message: 'Exam retrieved successfully',
      data: this.examResponseMapper.toGeneratedExamResponse(exam),
    };
  }
}
