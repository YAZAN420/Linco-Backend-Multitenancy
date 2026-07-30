import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentMessageCommandRepository } from './ports/departmentMessage-command.repository';
import { DepartmentMessageFactory } from '../domain/factories/departmentMessage.factory';
import { DepartmentMessage } from '../domain/departmentMessage';

import { UpdateDepartmentMessageInput } from './interfaces/update-departmentMessage-input.interface';
import { CreateDepartmentMessageInput } from './interfaces/create-departmentMessage-input.interface';
import { DepartmentMessagesQueryService } from './departmentMessages-query.service';
import { WsException } from '@nestjs/websockets';
import { StoragePort } from 'src/core/storage/storage.port';

@Injectable()
export class DepartmentMessagesCommandService {
  constructor(
    private readonly departmentMessageCommandRepository: DepartmentMessageCommandRepository,
    private readonly departmentMessageFactory: DepartmentMessageFactory,
    private readonly departmentMessageQueryService: DepartmentMessagesQueryService,
    private readonly storageService: StoragePort,
  ) {}

  async generateAttachmentUrl(fileName: string) {
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

    const ext = fileName.split('.').pop()?.toLowerCase() || '';
    const contentType = mimeTypesMap[ext] || 'application/octet-stream';

    const storageResult = await this.storageService.generateUploadUrl(
      fileName,
      contentType,
      true,
      'attachments',
      15,
    );

    return {
      fileName,
      ...storageResult,
    };
  }

  async create(
    departmentMemberId: string,
    departmentId: string,
    input: CreateDepartmentMessageInput,
  ): Promise<DepartmentMessage> {
    if (input.replyToId) {
      try {
        await this.departmentMessageQueryService.findById(
          departmentId,
          input.replyToId,
        );
      } catch {
        throw new WsException('errors.REPLY_MESSAGE_NOT_FOUND_IN_DEPARTMENT');
      }
    }
    const departmentMessage = this.departmentMessageFactory.createNew(
      departmentId,
      departmentMemberId,
      input.type,
      input.content,
      input.fileUrl,
      input.fileName,
      input.mimeType,
      input.fileSize,
      input.replyToId,
    );

    await this.departmentMessageCommandRepository.save(departmentMessage);

    return departmentMessage;
  }

  async update(
    departmentId: string,
    departmentMessageId: string,
    departmentMemberId: string,
    input: UpdateDepartmentMessageInput,
  ): Promise<DepartmentMessage> {
    const departmentMessage = await this.findById(
      departmentId,
      departmentMessageId,
    );

    if (departmentMessage.senderId !== departmentMemberId) {
      throw new NotFoundException(
        'DepartmentMessage not found or you are not the sender',
      );
    }

    departmentMessage.editContent(input.content);

    await this.departmentMessageCommandRepository.save(departmentMessage);

    return departmentMessage;
  }

  async remove(
    departmentId: string,
    departmentMessageId: string,
    departmentMemberId: string,
  ): Promise<DepartmentMessage> {
    const departmentMessage = await this.findById(
      departmentId,
      departmentMessageId,
    );

    if (departmentMessage.senderId !== departmentMemberId) {
      throw new NotFoundException(
        'DepartmentMessage not found or you are not the sender',
      );
    }

    departmentMessage.softDelete();

    await this.departmentMessageCommandRepository.save(departmentMessage);

    return departmentMessage;
  }

  async findById(
    departmentId: string,
    departmentMessageId: string,
  ): Promise<DepartmentMessage> {
    const departmentMessage =
      await this.departmentMessageCommandRepository.findById(
        departmentMessageId,
      );
    if (!departmentMessage || departmentMessage.departmentId !== departmentId) {
      throw new NotFoundException(
        'DepartmentMessage not found in this department',
      );
    }
    return departmentMessage;
  }
}
