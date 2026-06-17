import { Injectable } from '@nestjs/common';
import type { QuestionsBank as PrismaQuestionsBank } from 'src/generated/prisma/client';
import { QuestionsBank } from 'src/questionsBank/domain/questionsBank';

@Injectable()
export class PrismaQuestionsBankMapper {
  toDomain(raw: PrismaQuestionsBank): QuestionsBank {
    return new QuestionsBank(raw.id, {
      sectionId: raw.sectionId,
      text: raw.text,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(questionBank: QuestionsBank): PrismaQuestionsBank {
    return {
      id: questionBank.id,
      sectionId: questionBank.sectionId,
      text: questionBank.text,
      createdAt: questionBank.createdAt,
      updatedAt: questionBank.updatedAt,
    };
  }
}
