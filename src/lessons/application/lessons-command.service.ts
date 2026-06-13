import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonCommandRepository } from './ports/lesson-command.repository';
import { LessonFactory } from '../domain/factories/lesson.factory';
import { Lesson } from '../domain/lesson';

import { CreateLessonInput } from './interfaces/create-lesson-input.interface';
import { UpdateLessonInput } from './interfaces/update-lesson-input.interface';
import { Title } from '../domain/value-objects/title.vo';
import { LessonOrder } from '../domain/value-objects/lesson-order.vo';
import { Url } from '../domain/value-objects/url.vo';

@Injectable()
export class LessonsCommandService {
  constructor(
    private readonly lessonCommandRepository: LessonCommandRepository,
    private readonly lessonFactory: LessonFactory,
  ) {}

  async create(sectionId: string, input: CreateLessonInput): Promise<Lesson> {
    const lesson = this.lessonFactory.createNew(
      sectionId,
      input.title,
      input.order,
      input.videoUrl,
      input.subTitleUrl,
      input.courseId,
    );
    await this.lessonCommandRepository.save(lesson);
    return lesson;
  }

  async update(
    sectionId: string,
    lessonId: string,
    input: UpdateLessonInput,
  ): Promise<Lesson> {
    const lesson = await this.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');
    if (input.title) {
      const titleVo = Title.create(input.title);
      lesson.updateTitle(titleVo);
    }
    if (input.order) {
      const lessonOrderVo = LessonOrder.create(input.order);
      lesson.updateOrder(lessonOrderVo);
    }
    if (input.videoUrl) {
      const videoUrlVo = Url.create(input.videoUrl);
      lesson.updateVideoUrl(videoUrlVo);
    }
    if (input.subTitleUrl) {
      const subTitleUrlVo = Url.create(input.subTitleUrl);
      lesson.updateSubTitleUrl(subTitleUrlVo);
    }

    await this.lessonCommandRepository.save(lesson);
    return lesson;
  }

  async remove(sectionId: string, lessonId: string): Promise<void> {
    await this.findById(lessonId);
    await this.lessonCommandRepository.delete(lessonId);
  }

  async save(lesson: Lesson): Promise<void> {
    await this.lessonCommandRepository.save(lesson);
  }

  async findById(lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonCommandRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('lesson not found');
    return lesson;
  }
}
