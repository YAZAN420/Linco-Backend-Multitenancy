import { Injectable, NotFoundException } from '@nestjs/common';
import { ExamCommandRepository } from './ports/exam-command.repository';
import { Exam } from '../domain/exam';

import { CreateExamInput } from './interfaces/create-exam-input.interface';
import { UpdateExamInput } from './interfaces/update-exam-input.interface';
import { ExamFactory } from '../domain/factories/exam.factory';
import { Title } from '../domain/value-objects/title.vo';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';

@Injectable()
export class ExamsCommandService {
  constructor(
    private readonly examCommandRepository: ExamCommandRepository,
    private readonly courseQueryRepository: CourseQueryRepository,
    private readonly examFactory: ExamFactory,
  ) {}

  async create(sectionId: string, input: CreateExamInput): Promise<Exam> {
    const exam = this.examFactory.createNew(
      sectionId,
      input.title,
      input.numberOfQuestions,
      input.durationMinutes,
    );
    await this.examCommandRepository.save(exam);
    return exam;
  }

  async update(
    sectionId: string,
    examId: string,
    input: UpdateExamInput,
  ): Promise<Exam> {
    const exam = await this.findById(sectionId, examId);

    const { title, numberOfQuestions, durationMinutes } = input;
    if (title) exam.updateTitle(Title.create(title));
    if (numberOfQuestions) exam.updateNumberOfQuestions(numberOfQuestions);
    if (durationMinutes) exam.updateDurationMinutes(durationMinutes);

    await this.examCommandRepository.save(exam);
    return exam;
  }

  async remove(sectionId: string, examId: string): Promise<void> {
    await this.findById(sectionId, examId);
    await this.examCommandRepository.delete(examId);
  }

  async findById(sectionId: string, examId: string): Promise<Exam> {
    const exam = await this.examCommandRepository.findById(examId);
    await this.courseQueryRepository.findSectionById(sectionId);
    if (!exam) throw new NotFoundException('exam not found');
    return exam;
  }
}
