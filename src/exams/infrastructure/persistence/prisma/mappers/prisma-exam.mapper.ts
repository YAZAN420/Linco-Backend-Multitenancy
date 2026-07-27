import { Injectable } from '@nestjs/common';
import type { Exam as PrismaExam } from 'src/generated/prisma/client';
import { Exam } from 'src/exams/domain/exam';
import { Title } from 'src/exams/domain/value-objects/title.vo';

@Injectable()
export class PrismaExamMapper {
  toDomain(raw: PrismaExam): Exam {
    const titleVo = Title.fromPersistence(raw.title);

    return new Exam(raw.id, {
      sectionId: raw.sectionId,
      title: titleVo,
      durationMinutes: raw.durationMinutes,
      numberOfQuestions: raw.numberOfQuestions,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(exam: Exam): PrismaExam {
    return {
      id: exam.id,
      sectionId: exam.sectionId,
      title: exam.title,
      numberOfQuestions: exam.numberOfQuestions,
      durationMinutes: exam.durationMinutes,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }
}
