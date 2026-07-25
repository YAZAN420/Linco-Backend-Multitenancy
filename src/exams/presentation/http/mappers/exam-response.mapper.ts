import { Injectable } from '@nestjs/common';
import { ExamResponseDto } from '../dto/exam-response.dto';
import { Exam as PrismaExam } from 'src/generated/prisma/client';

@Injectable()
export class ExamResponseMapper {
  toResponseFromPrisma(exam: PrismaExam): ExamResponseDto {
    return new ExamResponseDto(
      exam.id,
      exam.title,
      exam.numberOfQuestions,
      exam.durationMinutes,
      exam.sectionId,
      exam.createdAt,
      exam.updatedAt,
    );
  }

  toResponseManyFromPrisma(exams: PrismaExam[]): ExamResponseDto[] {
    return exams.map((exam) => this.toResponseFromPrisma(exam));
  }
}
