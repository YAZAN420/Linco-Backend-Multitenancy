import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ExamAttemptQueryService } from 'src/exams/application/exams-attempts-query.service';
import { ExamAttemptResponseMapper } from './mappers/exam-attempt-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { ApiTags } from '@nestjs/swagger';
import { ExamResponseMapper } from './mappers/exam-response.mapper';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { ExamAttemptCommandService } from 'src/exams/application/exams-attempts-command.service';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';

@ApiTags('ExamAttempts')
@Controller('examAttempts')
export class ExamsAttemptQueryController {
  constructor(
    private readonly examAttemptQueryService: ExamAttemptQueryService,
    private readonly examAttemptCommandService: ExamAttemptCommandService,
    private readonly examAttemptResponseMapper: ExamAttemptResponseMapper,
    private readonly examResponseMapper: ExamResponseMapper,
  ) {}

  @Get('me')
  @UseGuards(DemoRolesGuard)
  async findMine(
    @ActiveDemoMember('id') demoMemberId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const attempts = await this.examAttemptQueryService.findAllCursor(
      demoMemberId,
      options,
    );

    return {
      message: 'messages.EXAM_ATTEMPTS_FETCHED_SUCCESSFULLY',
      data: this.examAttemptResponseMapper.toResponseManyFromPrisma(
        attempts.data,
      ),
      meta: attempts.meta,
    };
  }

  @Get('exams/:examId/eligibility')
  @UseGuards(DemoRolesGuard)
  async getEligibility(
    @ActiveDemoMember('id') demoMemberId: string,
    @Param('examId') examId: string,
  ) {
    return {
      message: 'messages.EXAM_ATTEMPT_ELIGIBILITY_RETRIEVED_SUCCESSFULLY',
      data: await this.examAttemptCommandService.getEligibility(
        demoMemberId,
        examId,
      ),
    };
  }

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
