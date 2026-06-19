import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Title } from '../value-objects/title.vo';
import { Quiz } from '../quiz';
import { PositiveInteger } from '../value-objects/positive-integer.vo';

@Injectable()
export class QuizFactory {
  public createNew(sectionId: string, title: string, numberOfQuestions: number, durationMinutes: number): Quiz {
    const now = new Date();
    const titleVo = Title.create(title);
    const numberOfQuestionsVo = PositiveInteger.create(numberOfQuestions, "number of questions");
    const durationMinutesVo = PositiveInteger.create(durationMinutes, "number of questions");
    return new Quiz(uuidv7(), {
      sectionId: sectionId,
      title: titleVo,
      numberOfQuestions: numberOfQuestionsVo,
      durationMinutes: durationMinutesVo,
      createdAt: now,
      updatedAt: now,
    });
  }
}
