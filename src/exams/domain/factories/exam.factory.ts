import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Title } from '../value-objects/title.vo';
import { PositiveInteger } from 'src/common/value-objects/positive-integer.vo';
import { Exam } from '../exam';

@Injectable()
export class ExamFactory {
  public createNew(sectionId: string, title: string, numberOfQuestions: number, durationMinutes: number): Exam {
    const now = new Date();
    const titleVo = Title.create(title);
    const numberOfQuestionsVo = PositiveInteger.create(numberOfQuestions, "number of questions");
    const durationMinutesVo = PositiveInteger.create(durationMinutes, "number of questions");
    return new Exam(uuidv7(), {
      sectionId: sectionId,
      title: titleVo,
      numberOfQuestions: numberOfQuestionsVo,
      durationMinutes: durationMinutesVo,
      createdAt: now,
      updatedAt: now,
    });
  }
}
