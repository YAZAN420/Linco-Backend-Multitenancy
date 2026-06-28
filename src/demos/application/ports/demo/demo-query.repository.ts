import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';

import { Department } from 'src/generated/prisma/client';
import {
  DemoWithMemberCount,
  DemoWithOwnership,
} from 'src/core/database/prisma/types';
import {
  FindDemosCursorQuery,
  FindDemosQuery,
  FindDepartmentCursorQuery,
} from '../../demo/interfaces/find-demos.query';

export abstract class DemoQueryRepository {
  abstract findAll(
    options: FindDemosQuery,
  ): Promise<PageDto<DemoWithMemberCount>>;
  abstract findAllForMe(
    options: FindDemosCursorQuery,
    userId: string,
  ): Promise<CursorPageDto<DemoWithOwnership>>;
  abstract findById(id: string): Promise<DemoWithOwnership | null>;
  abstract findDepartments(
    options: FindDepartmentCursorQuery,
    demoId: string,
  ): Promise<CursorPageDto<Department>>;
  abstract findDepartmentById(deptId: string): Promise<Department | null>;
  abstract demoExists(id: string): Promise<boolean>;
}
