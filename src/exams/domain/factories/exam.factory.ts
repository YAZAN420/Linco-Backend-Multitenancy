import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Title } from '../value-objects/title.vo';
import { Exam } from '../exam';

@Injectable()
export class ExamFactory {
  public createNew(
    sectionId: string,
    title: string,
    numberOfQuestions: number,
    durationMinutes: number,
  ): Exam {
    const now = new Date();
    const titleVo = Title.create(title);

    return new Exam(uuidv7(), {
      sectionId: sectionId,
      title: titleVo,
      numberOfQuestions: numberOfQuestions,
      durationMinutes: durationMinutes,
      createdAt: now,
      updatedAt: now,
    });
  }
}
