import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamQueryRepository } from './ports/exam-query.repository';

import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindExamAttemptsCursorQuery } from './interfaces/find-exam-attempts.query';
import { ExamAttemptQueryRepository } from './ports/exam-attempt-query.repository';
import { QuestionsBanksQueryService } from 'src/questionBanks/application/questionsBank-query.service';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';
import { Exam, ExamAttempt } from 'src/generated/prisma/client';

@Injectable()
export class ExamAttemptQueryService {
  constructor(
    private readonly examQueryRepository: ExamQueryRepository,
    private readonly examAttemptQueryRepository: ExamAttemptQueryRepository,
    private readonly questionsBanksQueryService: QuestionsBanksQueryService,
  ) {}

  async findAllCursor(
    demoMemberId: string,
    options: FindExamAttemptsCursorQuery,
  ): Promise<CursorPageDto<ExamAttempt>> {
    return this.examAttemptQueryRepository.findAllCursor(demoMemberId, options);
  }

  async findById(id: string): Promise<ExamAttempt> {
    const exam = await this.examAttemptQueryRepository.findById(id);
    if (!exam) throw new NotFoundException('errors.EXAM_ATTEMPT_NOT_FOUND');
    return exam;
  }

  async generateExam(examId: string): Promise<{
    exam: Exam;
    questions: QuestionsBankWithQuestionChoices[];
  }> {
    const exam = await this.examQueryRepository.findById(examId);
    if (!exam) throw new NotFoundException('errors.EXAM_NOT_FOUND');

    const randomQuestions =
      await this.questionsBanksQueryService.getRandomQuestions(
        exam.sectionId,
        exam.numberOfQuestions,
      );

    return {
      exam,
      questions: randomQuestions,
    };
  }
}
