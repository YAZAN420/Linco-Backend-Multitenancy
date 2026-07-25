import { Injectable } from '@nestjs/common';
import { QuestionsBankResponseDto } from '../dto/questionsBank-response.dto';

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

  toResponseManyFromPrisma(
    questionsBank: QuestionsBankWithQuestionChoices[],
  ): QuestionsBankResponseDto[] {
    return questionsBank.map((questionsBank) =>
      this.toResponseFromPrisma(questionsBank),
    );
  }
}
