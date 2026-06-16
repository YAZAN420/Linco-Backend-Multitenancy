import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsBankCommandRepository } from './ports/questionsBank-command.repository';
import { QuestionsBankFactory } from '../domain/factories/questionsBank.factory';
import { QuestionsBank } from '../domain/questionsBank';

import { CreateQuestionsBankInput } from './interfaces/create-questionsBank-input.interface';
import { UpdateQuestionsBankInput } from './interfaces/update-questionsBank-input.interface';

@Injectable()
export class QuestionsBankCommandService {
  constructor(
    private readonly questionsBankCommandRepository: QuestionsBankCommandRepository,
    private readonly questionsBankFactory: QuestionsBankFactory,
  ) {}

  async create(input: CreateQuestionsBankInput): Promise<QuestionsBank> {
    console.log(input);
    const questionsBank = this.questionsBankFactory.createNew();
    await this.questionsBankCommandRepository.save(questionsBank);
    return questionsBank;
  }

  async update(id: string, input: UpdateQuestionsBankInput): Promise<QuestionsBank> {
    console.log(input);
    const questionsBank = await this.findById(id);
    await this.questionsBankCommandRepository.save(questionsBank);
    return questionsBank;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.questionsBankCommandRepository.delete(id);
  }

  async save(questionsBank: QuestionsBank): Promise<void> {
    await this.questionsBankCommandRepository.save(questionsBank);
  }

  async findById(id: string): Promise<QuestionsBank> {
    const questionsBank = await this.questionsBankCommandRepository.findById(id);
    if (!questionsBank) throw new NotFoundException('questionsBank not found');
    return questionsBank;
  }

}
