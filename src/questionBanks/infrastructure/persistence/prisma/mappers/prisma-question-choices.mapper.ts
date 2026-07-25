import { Injectable } from '@nestjs/common';
import type { QuestionChoice as PrismaQuestionChoice } from 'src/generated/prisma/client';
import { QuestionChoice } from 'src/questionBanks/domain/question-choice';

@Injectable()
export class PrismaQuestionChoicesMapper {
  toDomain(raw: PrismaQuestionChoice): QuestionChoice {
    return new QuestionChoice(raw.id, {
      questionId: raw.questionId,
      text: raw.text,
      isCorrect: raw.isCorrect,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(choice: QuestionChoice): PrismaQuestionChoice {
    return {
      id: choice.id,
      questionId: choice.questionId,
      text: choice.text,
      isCorrect: choice.isCorrect,
      createdAt: choice.createdAt,
      updatedAt: choice.updatedAt,
    };
  }
}
