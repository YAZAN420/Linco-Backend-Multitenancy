import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindDepartmentMessagesCursorQuery } from '../interfaces/find-departmentMessages.query';

import { DepartmentMessageWithSenderAndReply } from 'src/core/database/prisma/types';

export abstract class DepartmentMessageQueryRepository {
  abstract findAllCursor(
    departmentId: string,
    options: FindDepartmentMessagesCursorQuery,
  ): Promise<CursorPageDto<DepartmentMessageWithSenderAndReply>>;
  abstract findById(
    departmentId: string,
    id: string,
  ): Promise<DepartmentMessageWithSenderAndReply | null>;
}
