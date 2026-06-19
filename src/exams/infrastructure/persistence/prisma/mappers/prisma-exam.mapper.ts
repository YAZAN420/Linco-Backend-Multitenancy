import { Injectable } from '@nestjs/common';
import type { Exam as PrismaExam} from 'src/generated/prisma/client';
import { Exam } from 'src/exams/domain/exam';
import { Title } from 'src/courses/domain/value-objects/title.vo';
import { PositiveInteger } from 'src/common/value-objects/positive-integer.vo';


@Injectable()
export class PrismaExamMapper {
  toDomain(raw: PrismaExam): Exam {
    const titleVo = Title.create(raw.title);
    const numberOfQuestionsVo = PositiveInteger.create(raw.numberOfQuestions, "Number Of Questions");
    const durationMinutesVo = PositiveInteger.create(raw.durationMiutes, "Duration Minutes");
    return new Exam(raw.id, {
      sectionId: raw.sectionId,
      title: titleVo,
      durationMinutes: durationMinutesVo,
      numberOfQuestions: numberOfQuestionsVo,
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
      durationMiutes: exam.durationMinutes,
      createdAt: exam.createdAt,
      updatedAt: exam.updatedAt,
    };
  }
}