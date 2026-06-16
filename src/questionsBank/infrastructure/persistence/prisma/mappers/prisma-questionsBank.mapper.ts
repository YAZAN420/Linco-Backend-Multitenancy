import { Injectable } from '@nestjs/common';
import type { QuestionBank as PrismaQuestionsBank } from 'src/generated/prisma/client';
import { QuestionsBank } from 'src/questionsBank/domain/questionsBank';

@Injectable()
export class PrismaQuestionsBankMapper {
  toDomain(raw: PrismaQuestionsBank): QuestionsBank {
    return new QuestionsBank(raw.id, {
      sectionId: raw.sectionId,
      text: raw.text,
      numberOfQuestions: raw.numberOfQuestions,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(questionBank: QuestionsBank): PrismaQuestionsBank {
    return {
      id: questionBank.id,
      sectionId: questionBank.sectionId,
      text: questionBank.text,
      numberOfQuestions: questionBank.numberOfQuestions,
      createdAt: questionBank.createdAt,
      updatedAt: questionBank.updatedAt,
    };
  }
}
