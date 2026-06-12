import { Injectable, NotFoundException } from '@nestjs/common';
import { LessonCommandRepository } from './ports/lesson-command.repository';
import { LessonFactory } from '../domain/factories/lesson.factory';
import { Lesson } from '../domain/lesson';

import { CreateLessonInput } from './interfaces/create-lesson-input.interface';
import { UpdateLessonInput } from './interfaces/update-lesson-input.interface';

@Injectable()
export class LessonsCommandService {
  constructor(
    private readonly lessonCommandRepository: LessonCommandRepository,
    private readonly lessonFactory: LessonFactory,
  ) {}

  async create(sectionId: string, input: CreateLessonInput): Promise<Lesson> {
    const lesson = this.lessonFactory.createNew(sectionId, input);
    await this.lessonCommandRepository.save(lesson);
    return lesson;
  }

  async update(
    sectionId: string,
    lessonId: string,
    input: UpdateLessonInput,
  ): Promise<Lesson> {
    const lesson = await this.findById(lessonId);
    lesson.updateTitle(input.title ?? lesson.title);
    lesson.updateOrder(input.order ?? lesson.order);
    lesson.updateVideoUrl(input.videoUrl ?? lesson.videoUrl);
    lesson.updateSubTitleUrl(input.subTitleUrl ?? lesson.subTitleUrl);
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
