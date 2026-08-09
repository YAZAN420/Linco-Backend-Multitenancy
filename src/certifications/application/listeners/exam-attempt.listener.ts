import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CertificationsCommandService } from '../certifications-command.service';

@Injectable()
export class ExamAttemptListener {
  constructor(
    private readonly certificationsService: CertificationsCommandService,
  ) {}

  @OnEvent('exam.attempt.created')
  async handle(payload: {
    examId: string;
    demoMemberId: string;
  }): Promise<void> {
    await this.certificationsService.issueIfCourseCompleted(
      payload.examId,
      payload.demoMemberId,
    );
  }
}
