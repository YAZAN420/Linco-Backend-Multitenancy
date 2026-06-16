import { Injectable } from '@nestjs/common';
import type { Lesson as PrismaLesson } from 'src/generated/prisma/client';
import { Lesson } from 'src/lessons/domain/lesson';
import { LessonOrder } from 'src/lessons/domain/value-objects/lesson-order.vo';
import { Title } from 'src/lessons/domain/value-objects/title.vo';
import { Url } from 'src/common/value-objects/url.vo';
import { PrismaAttachmentMapper } from './prisma-attachment.mapper';
import { LessonWithAttachments } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaLessonMapper {
  constructor(private readonly attachmentMapper: PrismaAttachmentMapper) {}
  toDomain(raw: LessonWithAttachments): Lesson {
    const titleVo = Title.fromPersistence(raw.title);
    const videoUrlVo = Url.fromPersistence(raw.videoUrl);
    const lessonOrderVo = LessonOrder.fromPersistence(raw.order);
    const subTitleUrlVo = raw.subTitleUrl
      ? Url.fromPersistence(raw.subTitleUrl)
      : null;
    return new Lesson(raw.id, {
      title: titleVo,
      order: lessonOrderVo,
      videoUrl: videoUrlVo,
      subTitleUrl: subTitleUrlVo,
      sectionId: raw.sectionId,
      attachments: raw.attachments
        ? raw.attachments.map((a) => this.attachmentMapper.toDomain(a))
        : [],
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
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
    };
  }
}
