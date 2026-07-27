import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamAttemptInput } from './interfaces/create-exam-attempt-input.interface';
import { ExamAttempt } from '../domain/exam-attempt';
import { ExamAttemptFactory } from '../domain/factories/exam-attempt.factory';
import { ExamAttemptCommandRepository } from './ports/exam-attempt-command.repository';
import { QuestionsBankQueryRepository } from 'src/questionBanks/application/ports/questionsBank-query.repository';
import { ExamQueryRepository } from './ports/exam-query.repository';
import { ExamUserAnswerInput } from './interfaces/exam-user-answer-input.interface';

@Injectable()
export class ExamAttemptCommandService {
  constructor(
    private readonly examAttemptCommandRepository: ExamAttemptCommandRepository,
    private readonly examAttemptFactory: ExamAttemptFactory,
    private readonly examQueryRepository: ExamQueryRepository,
    private readonly questionBankQueryRepository: QuestionsBankQueryRepository,
  ) {}

  async create(
    demoMemberId: string,
    input: CreateExamAttemptInput,
  ): Promise<ExamAttempt> {
    const exam = await this.examQueryRepository.findById(input.examId);
    if (!exam) throw new NotFoundException('Exam Not Found');

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

    await this.examAttemptCommandRepository.save(examAttempt);
    return examAttempt;
  }

  async remove(id: string): Promise<void> {
    await this.examAttemptCommandRepository.delete(id);
  }

  private calculateScore(
    userAnswers: ExamUserAnswerInput[],
    correctChoices: { questionId: string; correctChoiceId: string }[],
    totalQuestions: number,
  ): number {
    if (totalQuestions === 0) return 0;
    const correctChoiceMap = new Map(
      correctChoices.map((c) => [c.questionId, c.correctChoiceId]),
    );

    const processedQuestions = new Set<string>();
    let correctCount = 0;

    for (const answer of userAnswers) {
      if (processedQuestions.has(answer.questionId)) continue;
      processedQuestions.add(answer.questionId);

      const isCorrect =
        correctChoiceMap.get(answer.questionId) === answer.selectedChoiceId;
      if (isCorrect) correctCount++;
    }

    return Math.round((correctCount / totalQuestions) * 100);
  }
}
