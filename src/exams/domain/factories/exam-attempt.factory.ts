import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { ExamAttempt } from '../exam-attempt';

@Injectable()
export class ExamAttemptFactory {
  public createNew(
    demoMemberId: string,
    examId: string,
    score: number,
  ): ExamAttempt {
    const now = new Date();
    return new ExamAttempt(uuidv7(), {
      demoMemberId: demoMemberId,
      examId: examId,
      score: score,
      createdAt: now,
      updatedAt: now,
    });
  }
}
