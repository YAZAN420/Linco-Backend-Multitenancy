import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindDemosCursorQuery,
  FindDemosQuery,
  FindDepartmentCursorQuery,
} from '../interfaces/find-demos.query';
import { Department } from 'src/generated/prisma/client';
import { DemoWithMemberCount } from 'src/core/database/prisma/types';

export abstract class DemoQueryRepository {
  abstract findAll(
    options: FindDemosQuery,
  ): Promise<PageDto<DemoWithMemberCount>>;
  abstract findAllForMe(
    options: FindDemosCursorQuery,
    userId: string,
  ): Promise<CursorPageDto<DemoWithMemberCount>>;
  abstract findById(id: string): Promise<DemoWithMemberCount | null>;
  abstract findDepartments(
    options: FindDepartmentCursorQuery,
    demoId: string,
  ): Promise<CursorPageDto<Department>>;
  abstract findDepartmentById(deptId: string): Promise<Department | null>;
  abstract demoExists(id: string): Promise<boolean>;
}
