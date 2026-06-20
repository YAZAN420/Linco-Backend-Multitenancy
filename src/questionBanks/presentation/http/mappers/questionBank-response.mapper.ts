import { Injectable } from '@nestjs/common';
import { QuestionsBankResponseDto } from '../dto/questionsBank-response.dto';
import { QuestionsBank as PrismaQuestionsBank } from 'src/generated/prisma/client';
import { QuestionsBank as DomainQuestionsBank } from 'src/questionBanks/domain/questionsBank';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';

@Injectable()
export class QuestionsBankResponseMapper {
  toResponseFromPrisma(
    questionsBank: QuestionsBankWithQuestionChoices,
  ): QuestionsBankResponseDto {
    return new QuestionsBankResponseDto(
      questionsBank.id,
      questionsBank.sectionId,
      questionsBank.choices.map((choice) => [choice.text, choice.isCorrect]),
      questionsBank.text,
      questionsBank.createdAt,
      questionsBank.updatedAt,
    );
  }

  toResponseFromDomain(
    questionsBank: DomainQuestionsBank,
  ): QuestionsBankResponseDto {
    return new QuestionsBankResponseDto(
      questionsBank.id,
      questionsBank.sectionId,
      questionsBank.choices.map((choice) => [choice.text, choice.isCorrect]),
      questionsBank.text,
      questionsBank.createdAt,
      questionsBank.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    questionsBank: QuestionsBankWithQuestionChoices[],
  ): QuestionsBankResponseDto[] {
    return questionsBank.map((questionsBank) =>
      this.toResponseFromPrisma(questionsBank),
    );
  }
}
