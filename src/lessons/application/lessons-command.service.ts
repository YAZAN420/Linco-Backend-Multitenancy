import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonCommandRepository } from './ports/lesson-command.repository';
import { LessonFactory } from '../domain/factories/lesson.factory';
import { Lesson } from '../domain/lesson';

import { CreateLessonInput } from './interfaces/create-lesson-input.interface';
import { UpdateLessonInput } from './interfaces/update-lesson-input.interface';
import { Title } from '../domain/value-objects/title.vo';
import { LessonOrder } from '../domain/value-objects/lesson-order.vo';
import { Url } from '../../common/value-objects/url.vo';
import { StoragePort } from 'src/core/storage/storage.port';

@Injectable()
export class LessonsCommandService {
  constructor(
    private readonly lessonCommandRepository: LessonCommandRepository,
    private readonly lessonFactory: LessonFactory,
    private readonly storageService: StoragePort,
  ) {}

  async generateLessonVideoUploadUrl(fileName: string) {
    return await this.storageService.generateUploadUrl(
      fileName,
      'video/mp4',
      true,
      'lessons',
      60,
    );
  }

  async create(sectionId: string, input: CreateLessonInput): Promise<Lesson> {
    const lesson = this.lessonFactory.createNew(
      sectionId,
      input.title,
      input.order,
      input.videoUrl,
      input.description,
      input.duration,
      input.subTitleUrl ?? null,
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
    if (input.title !== undefined) {
      const titleVo = Title.create(input.title);
      lesson.updateTitle(titleVo);
    }
    if (input.order !== undefined) {
      const lessonOrderVo = LessonOrder.create(input.order);
      lesson.updateOrder(lessonOrderVo);
    }
    if (input.videoUrl !== undefined) {
      const videoUrlVo = Url.create(input.videoUrl);
      lesson.updateVideoUrl(videoUrlVo);
    }
    if (input.subTitleUrl !== undefined) {
      const subTitleUrlVo = Url.create(input.subTitleUrl);
      lesson.updateSubTitleUrl(subTitleUrlVo);
    }
    if (input.description !== undefined) {
      lesson.updateDescription(input.description);
    }
    if (input.duration !== undefined) {
      lesson.updateDuration(input.duration);
    }

    await this.lessonCommandRepository.save(lesson);
    return lesson;
  }

  async remove(sectionId: string, lessonId: string): Promise<void> {
    await this.findById(lessonId);
    await this.lessonCommandRepository.delete(lessonId);
  }

  private async findById(lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonCommandRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('lesson not found');
    return lesson;
  }
}
