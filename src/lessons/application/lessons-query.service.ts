import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindLessonsCursorQuery } from './interfaces/find-lessons.query';
import { Lesson } from 'src/generated/prisma/client';
import { LessonQueryRepository } from './ports/lesson-query.repository';

@Injectable()
export class LessonsQueryService {
  constructor(private readonly lessonQueryRepository: LessonQueryRepository) {}

  async findAllCursor(
    sectionId: string,
    options: FindLessonsCursorQuery,
  ): Promise<CursorPageDto<Lesson>> {
    return this.lessonQueryRepository.findAllCursor(sectionId, options);
  }

  async findById(sectionId: string, lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonQueryRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');
    return lesson;
  }
}
