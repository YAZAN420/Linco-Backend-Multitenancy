import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentMessageCommandRepository } from './ports/departmentMessage-command.repository';
import { DepartmentMessageFactory } from '../domain/factories/departmentMessage.factory';
import { DepartmentMessage } from '../domain/departmentMessage';

import { UpdateDepartmentMessageInput } from './interfaces/update-departmentMessage-input.interface';
import { CreateDepartmentMessageInput } from './interfaces/create-departmentMessage-input.interface';

@Injectable()
export class DepartmentMessagesCommandService {
  constructor(
    private readonly departmentMessageCommandRepository: DepartmentMessageCommandRepository,
    private readonly departmentMessageFactory: DepartmentMessageFactory,
  ) {}

  async create(
    departmentMemberId: string,
    departmentId: string,
    input: CreateDepartmentMessageInput,
  ): Promise<DepartmentMessage> {
    const departmentMessage = this.departmentMessageFactory.createNew(
      departmentId,
      departmentMemberId,
      input.type,
      input.content,
      input.blobName,
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
