import { Injectable } from '@nestjs/common';
import { Lesson } from '../lesson';
import { v7 as uuidv7 } from 'uuid';
import { Title } from '../value-objects/title.vo';
import { Url } from '../value-objects/url.vo';
import { LessonOrder } from '../value-objects/lesson-order.vo';

@Injectable()
export class LessonFactory {
  public createNew(
    sectionId: string,
    title: string,
    order: number,
    videoUrl: string,
    subTitleUrl: string | null,
    courseId: string,
  ): Lesson {
    const now = new Date();
    const titleVo = Title.create(title);
    const videoUrlVo = Url.create(videoUrl);
    const subTitleUrlVo = subTitleUrl ? Url.create(subTitleUrl) : null;
    const lessonOrderVo = LessonOrder.create(order);
    return new Lesson(uuidv7(), {
      title: titleVo,
      order: lessonOrderVo,
      videoUrl: videoUrlVo,
      subTitleUrl: subTitleUrlVo,
      sectionId,
      courseId,
      attachments: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
