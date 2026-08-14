import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestionsBankCommandRepository } from './ports/questionsBank-command.repository';
import { QuestionsBankFactory } from '../domain/factories/questionsBank.factory';
import { QuestionsBank } from '../domain/questionsBank';
import { CreateQuestionsBankInput } from './interfaces/create-questionsBank-input.interface';

import { QuestionChoiceFactory } from '../domain/factories/question-choice.factory';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';
import { DomainException } from 'src/common/exceptions/domain.exception';

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
    if (!section) throw new NotFoundException('errors.SECTION_NOT_FOUND');

    const questionsBank = this.questionsBankFactory.createNew(
      sectionId,
      input.note,
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
    const section =
      await this.sectionsQueryRepository.findSectionWithExamAndQuestionCount(
        sectionId,
      );
    if (!section) throw new NotFoundException('errors.SECTION_NOT_FOUND');

    const questionsBank = await this.questionsBankCommandRepository.findById(
      sectionId,
      questionBankId,
    );
    if (!questionsBank) {
      throw new NotFoundException('errors.QUESTION_BANK_NOT_FOUND');
    }

    const remainingQuestionCount = section._count.questionsBank - 1;
    if (
      section.exam !== null &&
      section.exam.numberOfQuestions > remainingQuestionCount
    ) {
      throw new DomainException('errors.NOT_ENOUGH_QUESTIONS_AVAILABLE');
    }

    await this.questionsBankCommandRepository.delete(sectionId, questionBankId);
  }

  async findById(
    sectionId: string,
    questionBankId: string,
  ): Promise<QuestionsBank> {
    const section =
      await this.sectionsQueryRepository.findSectionById(sectionId);
    if (!section) throw new NotFoundException('errors.SECTION_NOT_FOUND');

    const questionsBank = await this.questionsBankCommandRepository.findById(
      sectionId,
      questionBankId,
    );
    if (!questionsBank)
      throw new NotFoundException('errors.QUESTION_BANK_NOT_FOUND');
    return questionsBank;
  }
}
