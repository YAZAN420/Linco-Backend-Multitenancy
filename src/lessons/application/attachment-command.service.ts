import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateAttachmentInput } from './interfaces/create-attachment-input.interface';
import { Attachment } from '../domain/attachment';
import { UpdateAttachmentInput } from './interfaces/update-attachment-input.interface';
import { LessonCommandRepository } from './ports/lesson-command.repository';
import { AttachmentFactory } from '../domain/factories/attachment.factory';
import { Title } from '../domain/value-objects/title.vo';
import { FilePath } from '../../common/value-objects/file-path.vo';

@Injectable()
export class AttachmentCommandService {
  constructor(
    private readonly lessonCommandRepository: LessonCommandRepository,
    private readonly attachmentFactory: AttachmentFactory,
  ) {}

  async create(
    lessonId: string,
    input: CreateAttachmentInput,
  ): Promise<Attachment> {
    const lesson = await this.lessonCommandRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('lesson not found');

    const attachment = this.attachmentFactory.createNew(
      lessonId,
      input.name,
      input.path,
      input.mimeType,
    );

    lesson.addAttachment(attachment);
    await this.lessonCommandRepository.save(lesson);
    return attachment;
  }

  async update(
    lessonId: string,
    attachmentId: string,
    input: UpdateAttachmentInput,
  ): Promise<Attachment> {
    const lesson = await this.lessonCommandRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('lesson not found');

    const nameVo = input.name ? Title.create(input.name) : null;
    const pathVo = input.path ? FilePath.create(input.path) : null;

    lesson.updateAttachment(attachmentId, nameVo, pathVo, input.mimeType);
    await this.lessonCommandRepository.save(lesson);
    return lesson.attachments.find((a) => a.id === attachmentId)!;
  }

  async remove(lessonId: string, attachmentId: string): Promise<void> {
    const lesson = await this.lessonCommandRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('lesson not found');
    lesson.removeAttachment(attachmentId);
    await this.lessonCommandRepository.save(lesson);
  }

  async findById(lessonId: string, attachmentId: string): Promise<Attachment> {
    const lesson = await this.lessonCommandRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('Lesson not found');
    const attachment = lesson.attachments.find((a) => a.id === attachmentId);
    if (!attachment) throw new NotFoundException('Attachment not found');
    return attachment;
  }

  async exists(attachmentId: string): Promise<boolean> {
    const attachment =
      await this.lessonCommandRepository.findAttachmentById(attachmentId);
    return !!attachment;
  }
}
