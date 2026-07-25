import { Injectable } from '@nestjs/common';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';
import type { QuestionsBank as PrismaQuestionsBank } from 'src/generated/prisma/client';
import { QuestionsBank } from 'src/questionBanks/domain/questionsBank';
import { PrismaQuestionChoicesMapper } from './prisma-question-choices.mapper';

@Injectable()
export class PrismaQuestionsBankMapper {
  constructor(
    private readonly prismaQuestionCoicesMapper: PrismaQuestionChoicesMapper,
  ) {}

  toDomain(raw: QuestionsBankWithQuestionChoices): QuestionsBank {
    return new QuestionsBank(raw.id, {
      sectionId: raw.sectionId,
      question: raw.question,
      choices: raw.choices
        ? raw.choices.map((choice) =>
            this.prismaQuestionCoicesMapper.toDomain(choice),
          )
        : [],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(questionBank: QuestionsBank): PrismaQuestionsBank {
    return {
      id: questionBank.id,
      sectionId: questionBank.sectionId,
      question: questionBank.question,
      createdAt: questionBank.createdAt,
      updatedAt: questionBank.updatedAt,
    };
  }
}
