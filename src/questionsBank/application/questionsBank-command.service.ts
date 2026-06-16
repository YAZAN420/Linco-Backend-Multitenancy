import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsBankCommandRepository } from './ports/questionsBank-command.repository';
import { QuestionsBankFactory } from '../domain/factories/questionsBank.factory';
import { QuestionsBank } from '../domain/questionsBank';

import { UpdateQuestionsBankInput } from './interfaces/update-questionsBank-input.interface';
import { CreateQuestionsBankInput } from './interfaces/create-questionsBank-input.interface';

@Injectable()
export class QuestionsBankCommandService {
  constructor(
    private readonly questionsBankCommandRepository: QuestionsBankCommandRepository,
    private readonly questionsBankFactory: QuestionsBankFactory,
  ) {}

  async create(sectionId: string, input: CreateQuestionsBankInput): Promise<QuestionsBank> {
    const questionsBank = this.questionsBankFactory.createNew(sectionId, input.text, input.numberOfQuestions);
    await this.questionsBankCommandRepository.save(questionsBank);
    return questionsBank;
  }

  async update(sectionId: string, questionBankId: string, input: UpdateQuestionsBankInput): Promise<QuestionsBank> {
    console.log(input);
    const questionsBank = await this.findById(sectionId, questionBankId);
    await this.questionsBankCommandRepository.save(questionsBank);
    return questionsBank;
  }

  async remove(sectionId: string, questionBankId: string): Promise<void> {
    await this.findById(sectionId, questionBankId);
    await this.questionsBankCommandRepository.delete(questionBankId);
  }

  async findById(sectionId: string, questionBankId: string): Promise<QuestionsBank> {
    // To Do: section exists
    const questionsBank = await this.questionsBankCommandRepository.findById(questionBankId);
    if (!questionsBank) throw new NotFoundException('QuestionBank not found');
    return questionsBank;
  }
}
