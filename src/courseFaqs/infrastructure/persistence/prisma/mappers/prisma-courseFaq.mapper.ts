import { Injectable } from '@nestjs/common';
import type { CourseFaq as PrismaCourseFaq } from 'src/generated/prisma/client';
import { CourseFaq } from 'src/courseFaqs/domain/courseFaq';

@Injectable()
export class PrismaCourseFaqMapper {
  toDomain(raw: PrismaCourseFaq): CourseFaq {
    return new CourseFaq(raw.id, {
      question: raw.question,
      answer: raw.answer,
      courseId: raw.courseId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(courseFaq: CourseFaq): PrismaCourseFaq {
    return {
      id: courseFaq.id,
      question: courseFaq.question,
      answer: courseFaq.answer,
      courseId: courseFaq.courseId,
      createdAt: courseFaq.createdAt,
      updatedAt: courseFaq.updatedAt,
    };
  }
}
