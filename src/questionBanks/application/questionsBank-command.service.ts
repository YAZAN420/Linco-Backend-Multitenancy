import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsBankCommandRepository } from './ports/questionsBank-command.repository';
import { QuestionsBankFactory } from '../domain/factories/questionsBank.factory';
import { QuestionsBank } from '../domain/questionsBank';
import { CreateQuestionsBankInput } from './interfaces/create-questionsBank-input.interface';

import { QuestionChoiceFactory } from '../domain/factories/question-choice.factory';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';

@Injectable()
export class QuestionsBanksCommandService {
  constructor(
    private readonly questionsBankCommandRepository: QuestionsBankCommandRepository,
    private readonly sectionsQueryRepository: CourseQueryRepository,
    private readonly questionsBankFactory: QuestionsBankFactory,
    private readonly questionChoiceFactory: QuestionChoiceFactory,
  ) {}

  async create(
    sectionId: string,
    input: CreateQuestionsBankInput,
  ): Promise<QuestionsBank> {
    const section =
      await this.sectionsQueryRepository.findSectionById(sectionId);
    if (!section) throw new NotFoundException('Section not found');

    const questionsBank = this.questionsBankFactory.createNew(
      sectionId,
      input.question,
    );

    input.choices.forEach((element) => {
      const choice = this.questionChoiceFactory.createNew(
        questionsBank.id,
        element.text,
        element.isCorrect,
      );
      questionsBank.addChoice(choice);
    });

    await this.questionsBankCommandRepository.save(questionsBank);
    return questionsBank;
  }

  async remove(sectionId: string, questionBankId: string): Promise<void> {
    await this.findById(sectionId, questionBankId);
    await this.questionsBankCommandRepository.delete(sectionId, questionBankId);
  }

  async findById(
    sectionId: string,
    questionBankId: string,
  ): Promise<QuestionsBank> {
    const section =
      await this.sectionsQueryRepository.findSectionById(sectionId);
    if (!section) throw new NotFoundException('Section not found');

    const questionsBank = await this.questionsBankCommandRepository.findById(
      sectionId,
      questionBankId,
    );
    if (!questionsBank) throw new NotFoundException('QuestionBank not found');
    return questionsBank;
  }
}
