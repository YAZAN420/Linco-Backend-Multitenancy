import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamCommandRepository } from './ports/exam-command.repository';
import { Exam } from '../domain/exam';

import { CreateExamInput } from './interfaces/create-exam-input.interface';
import { UpdateExamInput } from './interfaces/update-exam-input.interface';
import { ExamFactory } from '../domain/factories/exam.factory';
import { Title } from '../domain/value-objects/title.vo';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';
import { DomainException } from 'src/common/exceptions/domain.exception';

@Injectable()
export class ExamsCommandService {
  constructor(
    private readonly examCommandRepository: ExamCommandRepository,
    private readonly courseQueryRepository: CourseQueryRepository,
    private readonly examFactory: ExamFactory,
  ) {}

  async create(sectionId: string, input: CreateExamInput): Promise<Exam> {
    const section =
      await this.courseQueryRepository.findSectionWithExamAndQuestionCount(
        sectionId,
      );
    if (!section) throw new NotFoundException('errors.SECTION_NOT_FOUND');
    this.ensureEnoughQuestions(
      input.numberOfQuestions,
      section._count.questionsBank,
    );

    const exam = this.examFactory.createNew(
      sectionId,
      input.title,
      input.numberOfQuestions,
      input.durationMinutes,
      input.passingScore,
    );
    await this.examCommandRepository.save(exam);
    return exam;
  }

  async update(
    sectionId: string,
    examId: string,
    input: UpdateExamInput,
  ): Promise<Exam> {
    const section =
      await this.courseQueryRepository.findSectionWithExamAndQuestionCount(
        sectionId,
      );
    if (!section) throw new NotFoundException('errors.SECTION_NOT_FOUND');

    const exam = await this.examCommandRepository.findById(examId);
    if (!exam || exam.sectionId !== sectionId) {
      throw new NotFoundException('errors.EXAM_NOT_FOUND');
    }

    const { title, numberOfQuestions, durationMinutes, passingScore } = input;
    this.ensureEnoughQuestions(
      numberOfQuestions ?? exam.numberOfQuestions,
      section._count.questionsBank,
    );

    if (title) exam.updateTitle(Title.create(title));
    if (numberOfQuestions !== undefined) {
      exam.updateNumberOfQuestions(numberOfQuestions);
    }
    if (durationMinutes) exam.updateDurationMinutes(durationMinutes);
    if (passingScore !== undefined) exam.updatePassingScore(passingScore);

    await this.examCommandRepository.save(exam);
    return exam;
  }

  async remove(sectionId: string, examId: string): Promise<void> {
    await this.findById(sectionId, examId);
    await this.examCommandRepository.delete(examId);
  }

  async findById(sectionId: string, examId: string): Promise<Exam> {
    const section = await this.courseQueryRepository.findSectionById(sectionId);
    if (!section) throw new NotFoundException('errors.SECTION_NOT_FOUND');
    const exam = await this.examCommandRepository.findById(examId);
    if (!exam || exam.sectionId !== sectionId) {
      throw new NotFoundException('errors.EXAM_NOT_FOUND');
    }
    return exam;
  }

  private ensureEnoughQuestions(
    numberOfQuestions: number,
    availableQuestions: number,
  ): void {
    if (numberOfQuestions > availableQuestions) {
      throw new DomainException('errors.NOT_ENOUGH_QUESTIONS_AVAILABLE');
    }
  }
}
