import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import {
  FindDemosCursorQuery,
  FindDemosQuery,
} from '../interfaces/find-demos.query';
import { Demo, Department } from 'src/generated/prisma/client';

export abstract class DemoQueryRepository {
  abstract findAll(options: FindDemosQuery): Promise<PageDto<Demo>>;
  abstract findAllForMe(
    options: FindDemosCursorQuery,
    ownerId: string,
  ): Promise<CursorPageDto<Demo>>;
  abstract findById(id: string): Promise<Demo | null>;
  abstract findDepartmentById(
    demoId: string,
    deptId: string,
  ): Promise<Department | null>;
}
