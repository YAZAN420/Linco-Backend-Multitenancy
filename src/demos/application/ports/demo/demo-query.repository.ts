import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';

import {
  DemoWithOwnership,
  DepartmentWithDetails,
} from 'src/core/database/prisma/types';
import {
  FindDemosCursorQuery,
  FindDemosQuery,
  FindDepartmentCursorQuery,
} from '../../demo/interfaces/find-demos.query';

export abstract class DemoQueryRepository {
  abstract findAll(
    options: FindDemosQuery,
  ): Promise<PageDto<DemoWithOwnership>>;
  abstract findAllForMe(
    options: FindDemosCursorQuery,
    userId: string,
  ): Promise<CursorPageDto<DemoWithOwnership>>;
  abstract findById(id: string): Promise<DemoWithOwnership | null>;
  abstract findDepartments(
    options: FindDepartmentCursorQuery,
    demoId: string,
    userId: string,
  ): Promise<CursorPageDto<DepartmentWithDetails>>;
  abstract findDepartmentById(
    deptId: string,
    userId?: string,
  ): Promise<DepartmentWithDetails | null>;
  abstract demoExists(id: string): Promise<boolean>;
}
