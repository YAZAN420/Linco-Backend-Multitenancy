import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { QuestionChoice } from '../question-choice';

@Injectable()
export class QuestionChoiceFactory {
  public createNew(
    questionId: string,
    text: string,
    isCorrect: boolean,
  ): QuestionChoice {
    const now = new Date();
    return new QuestionChoice(uuidv7(), {
      questionId: questionId,
      text: text,
      isCorrect: isCorrect,
      createdAt: now,
      updatedAt: now,
    });
  }
}
