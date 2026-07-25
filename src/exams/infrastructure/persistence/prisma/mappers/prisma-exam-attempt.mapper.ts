import { Injectable } from '@nestjs/common';
import type { ExamAttempt as PrismaExamAttempt } from 'src/generated/prisma/client';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';

@Injectable()
export class PrismaExamAttemptMapper {
  toDomain(raw: PrismaExamAttempt): ExamAttempt {
    return new ExamAttempt(raw.id, {
      examId: raw.examId,
      userId: raw.userId,
      score: raw.score,
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
