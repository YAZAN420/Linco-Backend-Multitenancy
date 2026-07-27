import { Injectable } from '@nestjs/common';
import { ExamAttemptResponseDto } from '../dto/exam-attempt-response.dto';
import { ExamAttempt as PrismaExamAttempt } from 'src/generated/prisma/client';

@Injectable()
export class ExamAttemptResponseMapper {
  toResponseFromPrisma(examAttempt: PrismaExamAttempt): ExamAttemptResponseDto {
    return new ExamAttemptResponseDto(
      examAttempt.id,
      examAttempt.demoMemberId,
      examAttempt.examId,
      examAttempt.score,
      examAttempt.createdAt,
      examAttempt.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    examAttempts: PrismaExamAttempt[],
  ): ExamAttemptResponseDto[] {
    return examAttempts.map((examAttempt) =>
      this.toResponseFromPrisma(examAttempt),
    );
  }
}
