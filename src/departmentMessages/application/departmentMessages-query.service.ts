import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';

import { FindDepartmentMessagesCursorQuery } from './interfaces/find-departmentMessages.query';

import { DepartmentMessageQueryRepository } from './ports/departmentMessage-query.repository';
import { DepartmentMessageWithSenderAndReply } from 'src/core/database/prisma/types';

@Injectable()
export class DepartmentMessagesQueryService {
  constructor(
    private readonly departmentMessageQueryRepository: DepartmentMessageQueryRepository,
  ) {}

  async findAllCursor(
    departmentId: string,
    options: FindDepartmentMessagesCursorQuery,
  ): Promise<CursorPageDto<DepartmentMessageWithSenderAndReply>> {
    return this.departmentMessageQueryRepository.findAllCursor(
      departmentId,
      options,
    );
  }

  async findById(
    departmentId: string,
    id: string,
  ): Promise<DepartmentMessageWithSenderAndReply> {
    const departmentMessage =
      await this.departmentMessageQueryRepository.findById(departmentId, id);
    if (!departmentMessage)
      throw new NotFoundException('errors.DEPARTMENT_MESSAGE_NOT_FOUND');
    return departmentMessage;
  }
}
