import { Injectable } from '@nestjs/common';
import { LessonResponseDto } from '../dto/lesson-response.dto';
import { Lesson as PrismaLesson } from 'src/generated/prisma/browser';
import { Lesson as DomainLesson } from 'src/lessons/domain/lesson';

@Injectable()
export class LessonResponseMapper {
  toResponseFromPrisma(lesson: PrismaLesson): LessonResponseDto {
    return new LessonResponseDto(
      lesson.id,
      lesson.title,
      lesson.order,
      lesson.videoUrl,
      lesson.subTitleUrl,
      lesson.sectionId,
      lesson.courseId,
      lesson.createdAt,
      lesson.updatedAt,
    );
  }

  toResponseFromDomain(lesson: DomainLesson): LessonResponseDto {
    return new LessonResponseDto(
      lesson.id,
      lesson.title,
      lesson.order,
      lesson.videoUrl,
      lesson.subTitleUrl,
      lesson.sectionId,
      lesson.courseId,
      lesson.createdAt,
      lesson.updatedAt,
    );
  }

  toResponseManyFromPrisma(lessons: PrismaLesson[]): LessonResponseDto[] {
    return lessons.map((lesson) => this.toResponseFromPrisma(lesson));
  }
}
