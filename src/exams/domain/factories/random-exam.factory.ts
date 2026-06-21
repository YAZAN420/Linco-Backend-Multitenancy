import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { Exam } from '../exam';
import { RandomExam } from '../random-exam';

@Injectable()
export class RandomExamFactory {
  public createNew(exam: Exam): RandomExam {
    const now = new Date();
    return new RandomExam(uuidv7(), {
      exam: exam,
      questions: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
