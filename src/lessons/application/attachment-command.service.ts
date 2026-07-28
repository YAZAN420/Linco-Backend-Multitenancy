import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateAttachmentInput } from './interfaces/create-attachment-input.interface';
import { Attachment } from '../domain/attachment';
import { UpdateAttachmentInput } from './interfaces/update-attachment-input.interface';
import { LessonCommandRepository } from './ports/lesson-command.repository';
import { AttachmentFactory } from '../domain/factories/attachment.factory';
import { Title } from '../domain/value-objects/title.vo';
import { FilePath } from '../../common/value-objects/file-path.vo';
import { Lesson } from '../domain/lesson';
import { StoragePort } from 'src/core/storage/storage.port';

@Injectable()
export class AttachmentCommandService {
  constructor(
    private readonly lessonCommandRepository: LessonCommandRepository,
    private readonly attachmentFactory: AttachmentFactory,
    private readonly storageService: StoragePort,
  ) {}

  async generateAttachmentUrls(fileNames: string[]) {
    const mimeTypesMap: Record<string, string> = {
      pdf: 'application/pdf',
      zip: 'application/zip',
      rar: 'application/x-rar-compressed',
      txt: 'text/plain',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
    };
    const uploadTasks = fileNames.map(async (file) => {
      const ext = file.split('.').pop()?.toLowerCase() || '';
      const contentType = mimeTypesMap[ext] || 'application/octet-stream';
      const storageResult = await this.storageService.generateUploadUrl(
        file,
        contentType,
        true,
        `attachments`,
        15,
      );

      return {
        fileName: file,
        ...storageResult,
      };
    });
    const attachmentsUrls = await Promise.all(uploadTasks);
    return attachmentsUrls;
  }

  async create(
    lessonId: string,
    input: CreateAttachmentInput,
  ): Promise<Attachment> {
    const lesson = await this.findLessonById(lessonId);

    const attachment = this.attachmentFactory.createNew(
      lessonId,
      input.name,
      input.path,
      input.mimeType ?? null,
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
    const lesson = await this.findLessonById(lessonId);

    const nameVo = input.name ? Title.create(input.name) : null;
    const pathVo = input.path ? FilePath.create(input.path) : null;

    lesson.updateAttachment(
      attachmentId,
      nameVo,
      pathVo,
      input.mimeType ?? null,
    );
    await this.lessonCommandRepository.save(lesson);
    return lesson.attachments.find((a) => a.id === attachmentId)!;
  }

  async remove(lessonId: string, attachmentId: string): Promise<void> {
    const lesson = await this.findLessonById(lessonId);
    lesson.removeAttachment(attachmentId);
    await this.lessonCommandRepository.save(lesson);
  }

  private async findLessonById(lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonCommandRepository.findById(lessonId);
    if (!lesson) throw new NotFoundException('errors.LESSON_NOT_FOUND');
    return lesson;
  }
}
