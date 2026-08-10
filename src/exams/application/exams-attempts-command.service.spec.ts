import { ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExamAttempt } from '../domain/exam-attempt';
import { Exam } from '../domain/exam';
import { ExamAttemptFactory } from '../domain/factories/exam-attempt.factory';
import { QuestionsBankQueryRepository } from 'src/questionBanks/application/ports/questionsBank-query.repository';
import { ExamAttemptCommandService } from './exams-attempts-command.service';
import { ExamAttemptCommandRepository } from './ports/exam-attempt-command.repository';
import { ExamQueryRepository } from './ports/exam-query.repository';

describe('ExamAttemptCommandService', () => {
  const exam = {
    id: 'exam-id',
    numberOfQuestions: 5,
    passingScore: 60,
  } as Exam;
  const examAttempt = { id: 'attempt-id' } as ExamAttempt;

  let repository: {
    hasPassedAttempt: jest.Mock;
    save: jest.Mock;
    delete: jest.Mock;
    findById: jest.Mock;
  };
  let factory: { createNew: jest.Mock };
  let examRepository: { findById: jest.Mock };
  let questionRepository: {
    findCorrectChoicesByQuestionIds: jest.Mock;
    findByIdWithoutSection: jest.Mock;
  };
  let eventEmitter: { emitAsync: jest.Mock };
  let service: ExamAttemptCommandService;

  beforeEach(() => {
    repository = {
      hasPassedAttempt: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    };
    factory = { createNew: jest.fn().mockReturnValue(examAttempt) };
    examRepository = { findById: jest.fn().mockResolvedValue(exam) };
    questionRepository = {
      findCorrectChoicesByQuestionIds: jest.fn(),
      findByIdWithoutSection: jest.fn().mockResolvedValue({}),
    };
    eventEmitter = { emitAsync: jest.fn() };

    service = new ExamAttemptCommandService(
      repository as unknown as ExamAttemptCommandRepository,
      factory as unknown as ExamAttemptFactory,
      examRepository as unknown as ExamQueryRepository,
      questionRepository as unknown as QuestionsBankQueryRepository,
      eventEmitter as unknown as EventEmitter2,
    );
  });

  it('allows a retry when the member has no passing attempt', async () => {
    repository.hasPassedAttempt.mockResolvedValue(false);
    questionRepository.findCorrectChoicesByQuestionIds.mockResolvedValue([
      { questionId: 'question-1', correctChoiceIds: ['choice-1'] },
      { questionId: 'question-2', correctChoiceIds: ['choice-2'] },
    ]);

    await service.create('member-id', {
      examId: 'exam-id',
      answers: [
        { questionId: 'question-1', selectedChoiceIds: ['choice-1'] },
        { questionId: 'question-2', selectedChoiceIds: ['choice-2'] },
      ],
    });

    expect(repository.hasPassedAttempt).toHaveBeenCalledWith(
      'member-id',
      'exam-id',
      60,
    );
    expect(factory.createNew).toHaveBeenCalledWith('member-id', 'exam-id', 40);
    expect(repository.save).toHaveBeenCalledWith(examAttempt);
  });

  it('blocks a retry after the member has passed the exam', async () => {
    repository.hasPassedAttempt.mockResolvedValue(true);

    await expect(
      service.create('member-id', { examId: 'exam-id', answers: [] }),
    ).rejects.toBeInstanceOf(ConflictException);

    expect(repository.save).not.toHaveBeenCalled();
  });
});
