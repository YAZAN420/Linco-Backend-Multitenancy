import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindCursorQuery } from '../../common/interfaces/find.query';
import { Attachment } from 'src/generated/prisma/client';
import { LessonQueryRepository } from './ports/lesson-query.repository';

@Injectable()
export class AttachmentQueryService {
  constructor(private readonly lessonQueryRepository: LessonQueryRepository) {}

  async findAllCursor(
    lessonId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<Attachment>> {
    const lesson = await this.lessonQueryRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');
    return this.lessonQueryRepository.findAttachmentsCursor(lessonId, options);
  }

  async findById(lessonId: string, attachmentId: string): Promise<Attachment> {
    const lesson = await this.lessonQueryRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');
    const attachment =
      await this.lessonQueryRepository.findAttachmentById(attachmentId);
    if (!attachment) throw new NotFoundException('Attachment not found');
    return attachment;
  }

  async exists(attachmentId: string): Promise<boolean> {
    const attachment =
      await this.lessonQueryRepository.findAttachmentById(attachmentId);
    return !!attachment;
  }
}
