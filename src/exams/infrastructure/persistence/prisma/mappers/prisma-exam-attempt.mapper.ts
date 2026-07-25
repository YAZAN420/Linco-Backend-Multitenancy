import { Injectable } from '@nestjs/common';
import type { ExamAttempt as PrismaExamAttempt } from 'src/generated/prisma/client';
import { PositiveInteger } from 'src/common/value-objects/positive-integer.vo';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';

@Injectable()
export class PrismaExamAttemptMapper {
  toDomain(raw: PrismaExamAttempt): ExamAttempt {
    const scoreVo = PositiveInteger.create(raw.score, 'score');
    return new ExamAttempt(raw.id, {
      examId: raw.examId,
      userId: raw.userId,
      score: scoreVo,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(exam: ExamAttempt): PrismaExamAttempt {
    return {
      id: exam.id,
      userId: exam.userId,
      examId: exam.examId,
      score: exam.score,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }
}
