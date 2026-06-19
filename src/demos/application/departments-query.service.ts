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
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException(`Demo with ID ${demoId} not found`);
    }
    return await this.demoQueryRepository.findDepartments(options, demoId);
  }

  async findDepartmentById(
    demoId: string,
    deptId: string,
  ): Promise<Department> {
    const demo = await this.demoQueryRepository.findById(demoId);
    if (!demo) {
      throw new NotFoundException(`Demo with ID ${demoId} not found`);
    }

    const department =
      await this.demoQueryRepository.findDepartmentById(deptId);

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${deptId} not found in this demo`,
      );
    }

    return department;
  }
}
