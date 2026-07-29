import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindCursorQuery } from 'src/common/interfaces/find.query';
import { DepartmentMemberWithUser } from 'src/core/database/prisma/types';

export abstract class DepartmentMemberQueryRepository {
  abstract findAllByDepartment(
    departmentId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<DepartmentMemberWithUser>>;

  abstract findById(
    departmentId: string,
    memberId: string,
  ): Promise<DepartmentMemberWithUser | null>;

  abstract findByUserId(
    departmentId: string,
    userId: string,
  ): Promise<DepartmentMemberWithUser | null>;
}
