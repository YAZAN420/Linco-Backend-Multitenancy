import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsBankCommandRepository } from './ports/questionsBank-command.repository';
import { QuestionsBankFactory } from '../domain/factories/questionsBank.factory';
import { QuestionsBank } from '../domain/questionsBank';
import { CreateQuestionsBankInput } from './interfaces/create-questionsBank-input.interface';
import { PrismaCourseQueryRepository } from 'src/courses/infrastructure/persistence/prisma/repositories/prisma-course-query.repository';
import { QuestionChoiceFactory } from '../domain/factories/question-choice.factory';

@Injectable()
export class QuestionsBanksCommandService {
  constructor(
    private readonly questionsBankCommandRepository: QuestionsBankCommandRepository,
    private readonly sectionsService: PrismaCourseQueryRepository,
    private readonly questionsBankFactory: QuestionsBankFactory,
    private readonly questionChoiceFactory: QuestionChoiceFactory,
  ) {}

  async create(
    sectionId: string,
    input: CreateQuestionsBankInput,
  ): Promise<QuestionsBank> {
    await this.sectionsService.findSectionById(sectionId);

    const questionsBank = this.questionsBankFactory.createNew(
      sectionId,
      input.text,
    );

    input.choices.forEach((element) => {
      const choice = this.questionChoiceFactory.createNew(questionsBank.id, element.text, element.isCorrect);
      questionsBank.addChoice(choice);
    });

    await this.questionsBankCommandRepository.save(questionsBank);
    return questionsBank;
  }

  async remove(
    sectionId: string,
    questionBankId: string,
  ): Promise<void> {
    await this.findById(sectionId, questionBankId);
    await this.questionsBankCommandRepository.delete(questionBankId);
  }

  async findById(
    sectionId: string,
    questionBankId: string,
  ): Promise<QuestionsBank> {
    await this.sectionsService.findSectionById(sectionId);
    const questionsBank =
      await this.questionsBankCommandRepository.findById(questionBankId);
    if (!questionsBank) throw new NotFoundException('QuestionBank not found');
    return questionsBank;
  }
}
