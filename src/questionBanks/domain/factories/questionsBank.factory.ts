import { Injectable } from '@nestjs/common';
import { QuestionsBank } from '../questionsBank';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class QuestionsBankFactory {
  public createNew(sectionId: string, note: string, question: string): QuestionsBank {
    const now = new Date();
    return new QuestionsBank(uuidv7(), {
      sectionId: sectionId,
      question: question,
      note: note,
      choices: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
