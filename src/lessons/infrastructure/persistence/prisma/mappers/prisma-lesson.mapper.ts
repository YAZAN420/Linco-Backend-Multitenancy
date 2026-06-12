import { Injectable } from '@nestjs/common';
import type { Lesson as PrismaLesson } from 'src/generated/prisma/client';
import { Lesson } from 'src/lessons/domain/lesson';

@Injectable()
export class PrismaLessonMapper {
  toDomain(raw: PrismaLesson): Lesson {
    return new Lesson(raw.id, {
      title: raw.title,
      order: raw.order,
      videoUrl: raw.videoUrl,
      subTitleUrl: raw.subTitleUrl,
      sectionId: raw.sectionId,
      courseId: raw.courseId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(lesson: Lesson): PrismaLesson {
    return {
      id: lesson.id,
      title: lesson.title,
      order: lesson.order,
      videoUrl: lesson.videoUrl,
      subTitleUrl: lesson.subTitleUrl,
      sectionId: lesson.sectionId,
      courseId: lesson.courseId,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}
