import { Injectable } from '@nestjs/common';
import { Lesson } from '../lesson';
import { v7 as uuidv7 } from 'uuid';
import { CreateLessonInput } from 'src/lessons/application/interfaces/create-lesson-input.interface';

@Injectable()
export class LessonFactory {
  public createNew(sectionId: string, input: CreateLessonInput): Lesson {
    const now = new Date();
    return new Lesson(uuidv7(), {
      title: input.title,
      order: input.order,
      videoUrl: input.videoUrl,
      subTitleUrl: input.subTitleUrl,
      sectionId: sectionId,
      courseId: input.courseId,
      createdAt: now,
      updatedAt: now,
    });
  }
}
