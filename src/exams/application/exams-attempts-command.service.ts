import { Injectable } from '@nestjs/common';
import { CreateExamAttemptInput } from './interfaces/create-exam-attempt-input.interface';
import { ExamAttempt } from '../domain/exam-attempt';
import { ExamAttemptFactory } from '../domain/factories/exam-attempt.factory';
import { ExamAttemptCommandRepository } from './ports/exam-attempt-command.repository';
import { ExamsQueryService } from './exams-query.service';
@Injectable()
export class ExamAttemptCommandService {
  constructor(
    private readonly examAttemptCommandRepository: ExamAttemptCommandRepository,
    private readonly examAttemptFactory: ExamAttemptFactory, 
    private readonly examsQueryService: ExamsQueryService
  ) {}
  
  async create(userId: string, input: CreateExamAttemptInput): Promise<ExamAttempt> {
    await this.examsQueryService.exists(input.examId);

    const examAttempt = this.examAttemptFactory.createNew(
      userId,
      input.examId,
      input.score
    );
    await this.examAttemptCommandRepository.save(examAttempt);
    return examAttempt
  }

  async remove(id: string): Promise<void> {
    await this.examAttemptCommandRepository.delete(id);
  }
}