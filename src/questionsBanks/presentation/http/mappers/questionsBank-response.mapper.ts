import { Injectable } from '@nestjs/common';
import { QuestionsBankResponseDto } from '../dto/questionsBank-response.dto';
import { QuestionsBank as PrismaQuestionsBank } from 'src/generated/prisma/client';
import { QuestionsBank as DomainQuestionsBank } from 'src/questionsBanks/domain/questionsBank';

@Injectable()
export class QuestionsBankResponseMapper {
  toResponseFromPrisma(
    questionsBank: PrismaQuestionsBank,
  ): QuestionsBankResponseDto {
    return new QuestionsBankResponseDto(
      questionsBank.id,
      questionsBank.sectionId,
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
      questionsBank.text,
      questionsBank.createdAt,
      questionsBank.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    questionsBank: PrismaQuestionsBank[],
  ): QuestionsBankResponseDto[] {
    return questionsBank.map((questionsBank) =>
      this.toResponseFromPrisma(questionsBank),
    );
  }
}
