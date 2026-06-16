import { Injectable } from '@nestjs/common';
import { QuestionsBank } from '../questionsBank';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class QuestionsBankFactory {
  public createNew(): QuestionsBank {
    const now = new Date();
    return new QuestionsBank(uuidv7(),{ 
      createdAt: now,
      updatedAt: now,
    });
  }
}
