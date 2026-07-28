import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExamAttemptQueryService } from 'src/exams/application/exams-attempts-query.service';
import { ExamAttemptResponseMapper } from './mappers/exam-attempt-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { ApiTags } from '@nestjs/swagger';
import { ExamResponseMapper } from './mappers/exam-response.mapper';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

@ApiTags('ExamAttempts')
@Controller('examAttempts')
export class ExamsAttemptQueryController {
  constructor(
    private readonly examAttemptQueryService: ExamAttemptQueryService,
    private readonly examAttemptResponseMapper: ExamAttemptResponseMapper,
    private readonly examResponseMapper: ExamResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @ActiveDemoMember('id') demoMemberId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const exams = await this.examAttemptQueryService.findAllCursor(
      demoMemberId,
      options,
    );

    return {
      message: 'messages.EXAM_ATTEMPTS_FETCHED_SUCCESSFULLY',
      data: this.examAttemptResponseMapper.toResponseManyFromPrisma(exams.data),
      meta: exams.meta,
    };
  }

  @Get(':examAttemptId')
  async findOne(@Param('examAttemptId') examAttemptId: string) {
    const exam = await this.examAttemptQueryService.findById(examAttemptId);

    return {
      message: 'messages.EXAM_ATTEMPT_RETRIEVED_SUCCESSFULLY',
      data: this.examAttemptResponseMapper.toResponseFromPrisma(exam),
    };
  }

  @Get('generate/:examId')
  async generateExam(@Param('examId') examId: string) {
    const exam = await this.examAttemptQueryService.generateExam(examId);

    return {
      message: 'messages.EXAM_RETRIEVED_SUCCESSFULLY',
      data: this.examResponseMapper.toGeneratedExamResponse(exam),
    };
  }
}
