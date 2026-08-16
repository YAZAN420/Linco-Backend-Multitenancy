import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateExamAttemptInput } from './interfaces/create-exam-attempt-input.interface';
import { ExamAttempt } from '../domain/exam-attempt';
import { ExamAttemptFactory } from '../domain/factories/exam-attempt.factory';
import { ExamAttemptCommandRepository } from './ports/exam-attempt-command.repository';
import { QuestionsBankQueryRepository } from 'src/questionBanks/application/ports/questionsBank-query.repository';
import { ExamQueryRepository } from './ports/exam-query.repository';
import { ExamUserAnswerInput } from './interfaces/exam-user-answer-input.interface';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';
import { Exam } from '../domain/exam';
import { ExamAttemptEligibility } from './interfaces/exam-attempt-eligibility.interface';

@Injectable()
export class ExamAttemptCommandService {
  constructor(
    private readonly examAttemptCommandRepository: ExamAttemptCommandRepository,
    private readonly examAttemptFactory: ExamAttemptFactory,
    private readonly examQueryRepository: ExamQueryRepository,
    private readonly questionBankQueryRepository: QuestionsBankQueryRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    demoMemberId: string,
    input: CreateExamAttemptInput,
  ): Promise<{
    examAttempt: ExamAttempt;
    exam: Exam;
    questions: QuestionsBankWithQuestionChoices[];
  }> {
    const exam = await this.examQueryRepository.findById(input.examId);
    if (!exam) throw new NotFoundException('errors.EXAM_NOT_FOUND');

    const eligibility = await this.evaluateEligibility(demoMemberId, exam);
    if (eligibility.reason === 'PREVIOUS_EXAMS_NOT_PASSED') {
      throw new ForbiddenException(
        'errors.PREVIOUS_EXAMS_MUST_BE_PASSED_BEFORE_ATTEMPTING_THIS_EXAM',
      );
    }
    if (eligibility.reason === 'ALREADY_PASSED') {
      throw new ConflictException('errors.EXAM_ATTEMPT_ALREADY_EXISTS');
    }

    const correctChoices =
      await this.questionBankQueryRepository.findCorrectChoicesByQuestionIds(
        input.answers.map((a) => a.questionId),
      );

    const calculatedScore = this.calculateScore(
      input.answers,
      correctChoices,
      exam.numberOfQuestions,
    );

    const examAttempt = this.examAttemptFactory.createNew(
      demoMemberId,
      input.examId,
      calculatedScore,
    );

    const questionsWithChoices = (await Promise.all(
      input.answers.map((a) =>
        this.questionBankQueryRepository.findByIdWithoutSection(a.questionId),
      ),
    )) as QuestionsBankWithQuestionChoices[];

    await this.examAttemptCommandRepository.save(examAttempt);
    await this.eventEmitter.emitAsync('exam.attempt.created', {
      examId: input.examId,
      demoMemberId,
    });
    return {
      examAttempt,
      exam,
      questions: questionsWithChoices,
    };
  }

  async remove(id: string, demoMemberId: string, role: string): Promise<void> {
    const attempt = await this.examAttemptCommandRepository.findById(id);
    if (!attempt) {
      throw new NotFoundException('errors.EXAM_ATTEMPT_NOT_FOUND');
    }

    if (
      attempt.demoMemberId !== demoMemberId &&
      role !== 'ADMIN' &&
      role !== 'OWNER'
    ) {
      throw new ForbiddenException(
        'errors.UNAUTHORIZED_TO_DELETE_EXAM_ATTEMPT',
      );
    }

    await this.examAttemptCommandRepository.delete(id);
  }

  async getEligibility(
    demoMemberId: string,
    examId: string,
  ): Promise<ExamAttemptEligibility> {
    const exam = await this.examQueryRepository.findById(examId);
    if (!exam) throw new NotFoundException('errors.EXAM_NOT_FOUND');
    return this.evaluateEligibility(demoMemberId, exam);
  }

  private async evaluateEligibility(
    demoMemberId: string,
    exam: Exam,
  ): Promise<ExamAttemptEligibility> {
    const hasPassedAllPreviousExams =
      await this.examAttemptCommandRepository.hasPassedAllPreviousExams(
        demoMemberId,
        exam.id,
      );
    if (!hasPassedAllPreviousExams) {
      return {
        examId: exam.id,
        canAttempt: false,
        reason: 'PREVIOUS_EXAMS_NOT_PASSED',
      };
    }

    const hasPassedAttempt =
      await this.examAttemptCommandRepository.hasPassedAttempt(
        demoMemberId,
        exam.id,
        exam.passingScore,
      );
    if (hasPassedAttempt) {
      return {
        examId: exam.id,
        canAttempt: false,
        reason: 'ALREADY_PASSED',
      };
    }

    return { examId: exam.id, canAttempt: true, reason: 'AVAILABLE' };
  }

  private calculateScore(
    userAnswers: ExamUserAnswerInput[],
    correctChoices: { questionId: string; correctChoiceIds: string[] }[],
    totalQuestions: number,
  ): number {
    if (totalQuestions === 0) return 0;
    const correctChoiceMap = new Map(
      correctChoices.map((c) => [c.questionId, c.correctChoiceIds]),
    );

    const processedQuestions = new Set<string>();
    let correctCount = 0;

    for (const answer of userAnswers) {
      if (processedQuestions.has(answer.questionId)) continue;
      processedQuestions.add(answer.questionId);

      const correctChoiceIds = correctChoiceMap.get(answer.questionId) ?? [];
      const selectedChoiceIds = new Set(answer.selectedChoiceIds);
      const isCorrect =
        correctChoiceIds.length > 0 &&
        correctChoiceIds.length === selectedChoiceIds.size &&
        correctChoiceIds.every((choiceId) => selectedChoiceIds.has(choiceId));
      if (isCorrect) correctCount++;
    }

    return Math.round((correctCount / totalQuestions) * 100);
  }
}
