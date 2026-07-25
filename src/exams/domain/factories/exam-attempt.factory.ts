import { Injectable } from '@nestjs/common';
import { v7 as uuidv7 } from 'uuid';
import { PositiveInteger } from 'src/common/value-objects/positive-integer.vo';
import { ExamAttempt } from '../exam-attempt';

@Injectable()
export class ExamAttemptFactory {
  public createNew(userId: string, examId: string, score: number): ExamAttempt {
    const scoreVo = PositiveInteger.create(score, 'score');
    const now = new Date();
    return new ExamAttempt(uuidv7(), {
      userId: userId,
      examId: examId,
      score: scoreVo,
      createdAt: now,
      updatedAt: now,
    });
  }
}
