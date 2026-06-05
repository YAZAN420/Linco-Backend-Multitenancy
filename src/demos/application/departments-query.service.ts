import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { Department } from 'src/generated/prisma/client';
import { DemoQueryRepository } from './ports/demo-query.repository';
import { FindDepartmentCursorQuery } from './interfaces/find-demos.query';

@Injectable()
export class DepartmentsQueryService {
  constructor(private readonly demoQueryRepository: DemoQueryRepository) {}

  async findDepartments(
    options: FindDepartmentCursorQuery,
    demoId: string,
  ): Promise<CursorPageDto<Department>> {
    return await this.demoQueryRepository.findDepartments(options, demoId);
  }

  async findDepartmentById(
    demoId: string,
    deptId: string,
  ): Promise<Department> {
    const department = await this.demoQueryRepository.findDepartmentById(
      demoId,
      deptId,
    );

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${deptId} not found in this demo`,
      );
    }

    return department;
  }
}
