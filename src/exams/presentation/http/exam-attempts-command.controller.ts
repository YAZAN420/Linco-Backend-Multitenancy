import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateExamAttemptDto } from './dto/create-exam-attempt.dto';
import { ExamAttemptCommandService } from 'src/exams/application/exams-attempts-command.service';
import { ExamAttemptResponseMapper } from './mappers/exam-attempt-response.mapper';
import { ApiTags } from '@nestjs/swagger';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';
import { ActiveDemoMemberData } from 'src/iam/domain/interfaces/active-demo-member.interface';

@ApiTags('ExamAttempts')
@Controller('examAttempts')
export class ExamsAttemptCommandController {
  constructor(
    private readonly examAttemptCommandService: ExamAttemptCommandService,
    private readonly examAttemptResponseMapper: ExamAttemptResponseMapper,
  ) {}

  @Delete(':examAttemptId')
  async remove(@Param('examAttemptId') courseId: string) {
    await this.examAttemptCommandService.remove(courseId);
    return {
      message: 'Exam Attempt deleted successfully',
      data: null,
    };
  }

  @Post()
  async create(
    @ActiveDemoMember() DemoMember: ActiveDemoMemberData,
    @Body() dto: CreateExamAttemptDto,
  ) {
    const examAttempt = await this.examAttemptCommandService.create(
      DemoMember.id,
      dto,
    );

    return {
      message: 'Exam Attempt created successfully',
      data: this.examAttemptResponseMapper.toResponseFromDomain(examAttempt),
    };
  }
}
