import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsBankCommandRepository } from './ports/questionsBank-command.repository';
import { QuestionsBankFactory } from '../domain/factories/questionsBank.factory';
import { QuestionsBank } from '../domain/questionsBank';

import { UpdateQuestionsBankInput } from './interfaces/update-questionsBank-input.interface';
import { CreateQuestionsBankInput } from './interfaces/create-questionsBank-input.interface';
import { SectionsCommandService } from 'src/courses/application/sections-command.service';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';

@Injectable()
export class QuestionsBankCommandService {
  constructor(
    private readonly questionsBankCommandRepository: QuestionsBankCommandRepository,
    private readonly sectionsService: SectionsQueryService,
    private readonly questionsBankFactory: QuestionsBankFactory,
  ) {}

  async create(
    courseId: string,
    sectionId: string,
    input: CreateQuestionsBankInput,
  ): Promise<QuestionsBank> {
    this.sectionsService.findById(courseId, sectionId);
    const questionsBank = this.questionsBankFactory.createNew(
      sectionId,
      input.text
    );
    await this.questionsBankCommandRepository.save(questionsBank);
    return questionsBank;
  }

  async update(
    courseId: string,
    sectionId: string,
    questionBankId: string,
    input: UpdateQuestionsBankInput,
  ): Promise<QuestionsBank> {
    console.log(input);
    const questionsBank = await this.findById(courseId, sectionId, questionBankId);
    await this.questionsBankCommandRepository.save(questionsBank);
    return questionsBank;
  }

  async remove(courseId: string, sectionId: string, questionBankId: string): Promise<void> {
    await this.findById(courseId, sectionId, questionBankId);
    await this.questionsBankCommandRepository.delete(questionBankId);
  }

  async findById(
    courseId: string,
    sectionId: string,
    questionBankId: string,
  ): Promise<QuestionsBank> {
    this.sectionsService.findById(courseId, sectionId);
    const questionsBank =
      await this.questionsBankCommandRepository.findById(questionBankId);
    if (!questionsBank) throw new NotFoundException('QuestionBank not found');
    return questionsBank;
  }
}
