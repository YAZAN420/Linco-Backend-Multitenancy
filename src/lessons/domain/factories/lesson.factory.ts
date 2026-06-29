import { Injectable } from '@nestjs/common';
import { Lesson } from '../lesson';
import { v7 as uuidv7 } from 'uuid';
import { Title } from '../value-objects/title.vo';
import { Url } from '../../../common/value-objects/url.vo';
import { LessonOrder } from '../value-objects/lesson-order.vo';

@Injectable()
export class LessonFactory {
  public createNew(
    sectionId: string,
    title: string,
    order: number,
    videoUrl: string,
    description: string,
    duration: number,
    subTitleUrl: string | null,
  ): Lesson {
    const now = new Date();
    const titleVo = Title.create(title);
    const videoUrlVo = Url.create(videoUrl);
    const subTitleUrlVo = subTitleUrl ? Url.create(subTitleUrl) : null;
    const lessonOrderVo = LessonOrder.create(order);
    return new Lesson(uuidv7(), {
      title: titleVo,
      description,
      duration,
      order: lessonOrderVo,
      videoUrl: videoUrlVo,
      subTitleUrl: subTitleUrlVo,
      sectionId,
      attachments: [],
      createdAt: now,
      updatedAt: now,
    });
  }
}
