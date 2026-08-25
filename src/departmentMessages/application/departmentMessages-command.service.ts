import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentMessageCommandRepository } from './ports/departmentMessage-command.repository';
import { DepartmentMessageFactory } from '../domain/factories/departmentMessage.factory';
import { DepartmentMessage } from '../domain/departmentMessage';

import { UpdateDepartmentMessageInput } from './interfaces/update-departmentMessage-input.interface';
import { CreateDepartmentMessageInput } from './interfaces/create-departmentMessage-input.interface';
import { DepartmentMessagesQueryService } from './departmentMessages-query.service';
import { WsException } from '@nestjs/websockets';
import { UploadUrlService } from 'src/core/storage/upload-url.service';

@Injectable()
export class DepartmentMessagesCommandService {
  constructor(
    private readonly departmentMessageCommandRepository: DepartmentMessageCommandRepository,
    private readonly departmentMessageFactory: DepartmentMessageFactory,
    private readonly departmentMessageQueryService: DepartmentMessagesQueryService,
    private readonly uploadUrlService: UploadUrlService,
  ) {}

  async generateAttachmentUrl(fileName: string) {
    return await this.uploadUrlService.generateUrl(fileName, 'attachments');
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
        'errors.DEPARTMENT_MESSAGE_NOT_FOUND_OR_NOT_SENDER',
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
        'errors.DEPARTMENT_MESSAGE_NOT_FOUND_OR_NOT_SENDER',
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
        'errors.DEPARTMENT_MESSAGE_NOT_FOUND_IN_THIS_DEPARTMENT',
      );
    }
    return departmentMessage;
  }
}
