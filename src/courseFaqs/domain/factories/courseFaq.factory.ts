import { Injectable } from '@nestjs/common';
import { CourseFaq } from '../courseFaq';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class CourseFaqFactory {
  public createNew(
    question: string,
    answer: string,
    courseId: string,
  ): CourseFaq {
    const now = new Date();
    return new CourseFaq(uuidv7(), {
      question: question,
      answer: answer,
      courseId: courseId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
