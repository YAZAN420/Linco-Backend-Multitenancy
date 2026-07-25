import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamQueryRepository } from './ports/exam-query.repository';

import { RandomExam } from '../domain/random-exam';
import { RandomExamFactory } from '../domain/factories/random-exam.factory';
import { ExamAttempt } from '../domain/exam-attempt';
import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindExamAttemptsCursorQuery,
  FindExamAttemptsQuery,
} from './interfaces/find-exam-attempts.query';
import { ExamAttemptQueryRepository } from './ports/exam-attempt-query.repository';
import { PrismaQuestionsBankQueryRepository } from 'src/questionBanks/infrastructure/persistence/prisma/repositories/prisma-questionBank-query.repository';

@Injectable()
export class ExamAttemptQueryService {
  constructor(
    private readonly examQueryRepository: ExamQueryRepository,
    private readonly examAttemptQueryRepository: ExamAttemptQueryRepository,
    private readonly questionsBankQueryRepository: PrismaQuestionsBankQueryRepository,
    private readonly examAttemptFactory: RandomExamFactory,
  ) {}

  async findAll(
    courseId: string,
    pageOptionsDto: FindExamAttemptsQuery,
  ): Promise<PageDto<ExamAttempt>> {
    return this.examAttemptQueryRepository.findAll(courseId, pageOptionsDto);
  }

  async findAllCursor(
    courseId: string,
    options: FindExamAttemptsCursorQuery,
  ): Promise<CursorPageDto<ExamAttempt>> {
    return this.examAttemptQueryRepository.findAllCursor(courseId, options);
  }

  async findById(id: string): Promise<ExamAttempt> {
    const exam = await this.examAttemptQueryRepository.findById(id);
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  async generateExam(examId: string): Promise<RandomExam> {
    const exam = await this.examQueryRepository.findById(examId);
    if (!exam) throw new NotFoundException('Exam Not Found');

    const randomQuestions =
      await this.questionsBankQueryRepository.getRandomQuestions(
        exam.sectionId,
        exam.numberOfQuestions,
      );

    const examAttempt = this.examAttemptFactory.createNew(exam);
    randomQuestions.map((question) => {
      examAttempt.addQuestions(question);
    });
    return examAttempt;
  }
}
