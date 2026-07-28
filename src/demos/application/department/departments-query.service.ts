import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { DemoQueryRepository } from '../ports/demo/demo-query.repository';
import { FindDepartmentCursorQuery } from '../demo/interfaces/find-demos.query';
import { DepartmentWithDetails } from 'src/core/database/prisma/types';

@Injectable()
export class DepartmentsQueryService {
  constructor(private readonly demoQueryRepository: DemoQueryRepository) {}

  async findDepartments(
    options: FindDepartmentCursorQuery,
    demoId: string,
    userId: string,
  ): Promise<CursorPageDto<DepartmentWithDetails>> {
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException('errors.DEMO_WITH_ID_DEMO_ID_NOT_FOUND');
    }
    return await this.demoQueryRepository.findDepartments(
      options,
      demoId,
      userId,
    );
  }

  async findDepartmentById(
    demoId: string,
    deptId: string,
    userId: string,
  ): Promise<DepartmentWithDetails> {
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException('errors.DEMO_WITH_ID_DEMO_ID_NOT_FOUND');
    }

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
}
