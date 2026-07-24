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

@ApiTags('ExamAttempts')
@UseGuards(DemoRolesGuard)
@Controller('examAttempts')
export class ExamsAttemptCommandController {
  constructor(
    private readonly examAttemptCommandService: ExamAttemptCommandService,
    private readonly examAttemptResponseMapper: ExamAttemptResponseMapper,
  ) {}

  @Delete(':examAttemptId')
  async remove(@Param('examAttemptId') examAttemptId: string) {
    await this.examAttemptCommandService.remove(examAttemptId);
    return {
      message: 'Exam Attempt deleted successfully',
      data: null,
    };
  }

  @Post()
  async create(
    @ActiveDemoMember('id') demoMemberId: string,
    @Body() dto: CreateExamAttemptDto,
  ) {
    const examAttempt = await this.examAttemptCommandService.create(
      demoMemberId,
      dto,
    );

    return {
      message: 'Exam Attempt created successfully',
      data: this.examAttemptResponseMapper.toResponseFromDomain(examAttempt),
    };
  }
}
