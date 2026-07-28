import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateExamAttemptDto } from './dto/create-exam-attempt.dto';
import { ExamAttemptCommandService } from 'src/exams/application/exams-attempts-command.service';
import { ExamAttemptResponseMapper } from './mappers/exam-attempt-response.mapper';
import { ApiTags } from '@nestjs/swagger';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ExamAttemptQueryService } from 'src/exams/application/exams-attempts-query.service';

@ApiTags('ExamAttempts')
@UseGuards(DemoRolesGuard)
@Controller('examAttempts')
export class ExamsAttemptCommandController {
  constructor(
    private readonly examAttemptCommandService: ExamAttemptCommandService,
    private readonly examAttemptQueryService: ExamAttemptQueryService,
    private readonly examAttemptResponseMapper: ExamAttemptResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveDemoMember('id') demoMemberId: string,
    @Body() dto: CreateExamAttemptDto,
  ) {
    const createdExamAttempt = await this.examAttemptCommandService.create(
      demoMemberId,
      dto,
    );
    const examAttempt = await this.examAttemptQueryService.findById(
      createdExamAttempt.id,
    );

    return {
      message: 'messages.EXAM_ATTEMPT_CREATED_SUCCESSFULLY',
      data: this.examAttemptResponseMapper.toResponseFromPrisma(examAttempt),
    };
  }

  @Delete(':examAttemptId')
  async remove(@Param('examAttemptId') examAttemptId: string) {
    await this.examAttemptCommandService.remove(examAttemptId);
    return {
      message: 'messages.EXAM_ATTEMPT_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
