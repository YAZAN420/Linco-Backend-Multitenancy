import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentMessageCommandRepository } from './ports/departmentMessage-command.repository';
import { DepartmentMessageFactory } from '../domain/factories/departmentMessage.factory';
import { DepartmentMessage } from '../domain/departmentMessage';

import { UpdateDepartmentMessageInput } from './interfaces/update-departmentMessage-input.interface';
import { CreateDepartmentMessageInput } from './interfaces/create-departmentMessage-input.interface';
import { DepartmentMessagesQueryService } from './departmentMessages-query.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class DepartmentMessagesCommandService {
  constructor(
    private readonly departmentMessageCommandRepository: DepartmentMessageCommandRepository,
    private readonly departmentMessageFactory: DepartmentMessageFactory,
    private readonly departmentMessageQueryService: DepartmentMessagesQueryService,
  ) {}

  async create(
    departmentMemberId: string,
    departmentId: string,
    input: CreateDepartmentMessageInput,
  ): Promise<DepartmentMessage> {
    if (input.replyToId) {
      const parentMessage = await this.departmentMessageQueryService.findById(
        departmentId,
        input.replyToId,
      );
      if (!parentMessage) {
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
    departmentMessageId: string,
    departmentMemberId: string,
    input: UpdateDepartmentMessageInput,
  ): Promise<DepartmentMessage> {
    const departmentMessage = await this.findById(departmentMessageId);

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
    departmentMessageId: string,
    departmentMemberId: string,
  ): Promise<DepartmentMessage> {
    const departmentMessage = await this.findById(departmentMessageId);

    if (departmentMessage.senderId !== departmentMemberId) {
      throw new NotFoundException(
        'DepartmentMessage not found or you are not the sender',
      );
    }

    departmentMessage.softDelete();

    await this.departmentMessageCommandRepository.save(departmentMessage);

    return departmentMessage;
  }

  async findById(departmentMessageId: string): Promise<DepartmentMessage> {
    const departmentMessage =
      await this.departmentMessageCommandRepository.findById(
        departmentMessageId,
      );
    if (!departmentMessage)
      throw new NotFoundException('DepartmentMessage not found');
    return departmentMessage;
  }
}
