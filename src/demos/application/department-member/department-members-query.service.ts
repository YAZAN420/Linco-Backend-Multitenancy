import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { DepartmentMemberQueryRepository } from '../ports/department-member/department-member-query.repository';
import { FindCursorQuery } from 'src/common/interfaces/find.query';
import { DepartmentMemberWithUser } from 'src/core/database/prisma/types';
import { DemoQueryRepository } from '../ports/demo/demo-query.repository';

@Injectable()
export class DepartmentMembersQueryService {
  constructor(
    private readonly departmentMemberQueryRepository: DepartmentMemberQueryRepository,
    private readonly demoQueryRepository: DemoQueryRepository,
  ) {}

  async findAllByDepartment(
    departmentId: string,
    options: FindCursorQuery,
  ): Promise<CursorPageDto<DepartmentMemberWithUser>> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    }
    return await this.departmentMemberQueryRepository.findAllByDepartment(
      departmentId,
      options,
    );
  }

  async findById(
    departmentId: string,
    memberId: string,
  ): Promise<DepartmentMemberWithUser> {
    const department =
      await this.demoQueryRepository.findDepartmentById(departmentId);
    if (!department) {
      throw new NotFoundException('errors.DEPARTMENT_NOT_FOUND');
    }
    const member = await this.departmentMemberQueryRepository.findById(
      departmentId,
      memberId,
    );
    if (!member) {
      throw new NotFoundException('errors.MEMBER_NOT_FOUND_IN_THIS_DEPARTMENT');
    }
    return member;
  }
}
