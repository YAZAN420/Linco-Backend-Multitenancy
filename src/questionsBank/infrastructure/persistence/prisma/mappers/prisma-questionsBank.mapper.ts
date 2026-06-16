import { Injectable } from '@nestjs/common';
import type {
  QuestionsBank as PrismaQuestionsBank,
} from 'src/generated/prisma/client';
import { QuestionsBank } from 'src/questionsBank/domain/questionsBank';


@Injectable()
export class PrismaQuestionsBankMapper {
  toDomain(raw: PrismaQuestionsBank): QuestionsBank {
    return new QuestionsBank(
      raw.id,{
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(questionsBank: QuestionsBank): PrismaQuestionsBank {
    return {
      id: questionsBank.id,
      createdAt: questionsBank.createdAt,
      updatedAt: questionsBank.updatedAt,
    };
  }
}