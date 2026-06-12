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

  async create(input: CreateLessonInput): Promise<Lesson> {
    const lesson = this.lessonFactory.createNew(input);
    await this.lessonCommandRepository.save(lesson);
    return lesson;
  }

  async update(id: string, input: UpdateLessonInput): Promise<Lesson> {
    console.log(input);
    const lesson = await this.findById(id);
    await this.lessonCommandRepository.save(lesson);
    return lesson;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.lessonCommandRepository.delete(id);
  }

  async save(lesson: Lesson): Promise<void> {
    await this.lessonCommandRepository.save(lesson);
  }

  async findById(id: string): Promise<Lesson> {
    const lesson = await this.lessonCommandRepository.findById(id);
    if (!lesson) throw new NotFoundException('lesson not found');
    return lesson;
  }
}
