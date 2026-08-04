import { Injectable } from '@nestjs/common';
import { ExamResponseDto } from '../dto/exam-response.dto';
import { Exam as PrismaExam } from 'src/generated/prisma/client';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';

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

  toGeneratedExamResponse(data: {
    exam: PrismaExam;
    questions: QuestionsBankWithQuestionChoices[];
  }) {
    return {
      id: data.exam.id,
      sectionId: data.exam.sectionId,
      title: data.exam.title,
      durationMinutes: data.exam.durationMinutes,
      numberOfQuestions: data.exam.numberOfQuestions,
      questions: data.questions.map((q) => ({
        id: q.id,
        question: q.question,
        note: q.note,
        choices: q.choices.map((c) => ({
          id: c.id,
          choice: c.choice,
        })),
      })),
    };
  }

  toResponseManyFromPrisma(exams: PrismaExam[]): ExamResponseDto[] {
    return exams.map((exam) => this.toResponseFromPrisma(exam));
  }
}
