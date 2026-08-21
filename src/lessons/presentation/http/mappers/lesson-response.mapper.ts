import { Injectable } from '@nestjs/common';
import { LessonResponseDto } from '../dto/lesson-response.dto';
import { Lesson as PrismaLesson } from 'src/generated/prisma/client';
import { Lesson as DomainLesson } from 'src/lessons/domain/lesson';

type PrismaLessonWithAttachmentCount = PrismaLesson & {
  readonly _count?: { readonly attachments: number };
};

@Injectable()
export class LessonResponseMapper {
  toResponseFromPrisma(
    lesson: PrismaLessonWithAttachmentCount,
  ): LessonResponseDto {
    return new LessonResponseDto(
      lesson.id,
      lesson.title,
      lesson.order,
      lesson.videoUrl,
      lesson.subTitleUrl,
      lesson.sectionId,
      lesson.duration,
      lesson.description,
      lesson._count?.attachments ?? 0,
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
      lesson.duration,
      lesson.description,
      lesson.attachments.length,
      lesson.createdAt,
      lesson.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    lessons: PrismaLessonWithAttachmentCount[],
  ): LessonResponseDto[] {
    return lessons.map((lesson) => this.toResponseFromPrisma(lesson));
  }
}
