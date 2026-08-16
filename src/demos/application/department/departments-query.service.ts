import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { DemoQueryRepository } from '../ports/demo/demo-query.repository';
import { FindDepartmentCursorQuery } from '../demo/interfaces/find-demos.query';
import {
  DepartmentLeaderboardItem,
  DepartmentWithDetails,
} from 'src/core/database/prisma/types';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';

@Injectable()
export class DepartmentsQueryService {
  constructor(private readonly demoQueryRepository: DemoQueryRepository) {}

  async findDepartments(
    options: FindDepartmentCursorQuery,
    demoId: string,
    userId: string,
  ): Promise<CursorPageDto<DepartmentWithDetails>> {
    return await this.demoQueryRepository.findDepartments(
      options,
      demoId,
      userId,
    );
  }

  async findDepartmentById(
    deptId: string,
    userId: string,
  ): Promise<DepartmentWithDetails> {
    const department = await this.demoQueryRepository.findDepartmentById(
      deptId,
      userId,
    );

    if (!department) {
      throw new NotFoundException(
        'errors.DEPARTMENT_WITH_ID_DEPT_ID_NOT_FOUND_IN_THIS_DEMO',
      );
    }

    return department;
  }

  async getDepartmentLeaderboard(
    deptId: string,
    options: CursorPageOptionsDto,
  ): Promise<CursorPageDto<DepartmentLeaderboardItem>> {
    return await this.demoQueryRepository.getDepartmentLeaderboard(
      deptId,
      options,
    );
  }
}
