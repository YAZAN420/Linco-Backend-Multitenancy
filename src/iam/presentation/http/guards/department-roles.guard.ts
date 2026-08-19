import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common/interfaces/app-cls-store.interface';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';
import { Request } from 'express';

import { DepartmentRoles } from '../decorators/department-roles.decorator';

import { DepartmentMemberQueryRepository } from 'src/demos/application/ports/department-member/department-member-query.repository';
import { DepartmentMemberRole } from 'src/demos/domain/enums/department-member-role.enum';
import { ActiveDepartmentMemberData } from 'src/iam/domain/interfaces/active-department-member.interface';
import { DepartmentMembersCommandService } from 'src/demos/application/department-member/department-members-command.service';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { JobTitle } from 'src/demos/domain/enums/job-title.enum';

@Injectable()
export class DepartmentRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<AppClsStore>,
    private readonly departmentMemberQueryRepository: DepartmentMemberQueryRepository,
    private readonly departmentMemberCommandService: DepartmentMembersCommandService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const activeDemoMember = this.cls.get(CLS_KEYS.DEMO_MEMBER);
    if (!activeDemoMember) {
      throw new ForbiddenException(
        'errors.WORKSPACE_CONTEXT_IS_MISSING_OR_INVALID',
      );
    }
    const departmentIdRaw = request.headers['x-department-id'];

    const departmentId = Array.isArray(departmentIdRaw)
      ? departmentIdRaw[0]
      : departmentIdRaw;

    if (!activeDemoMember.demoId || !departmentId) {
      throw new ForbiddenException(
        'errors.WORKSPACE_AND_DEPARTMENT_CONTEXT_ARE_REQUIRED',
      );
    }

    let deptMember = await this.departmentMemberQueryRepository.findById(
      departmentId,
      activeDemoMember.id,
    );

    if (
      !deptMember &&
      (activeDemoMember.role === DemoMemberRole.ADMIN ||
        activeDemoMember.role === DemoMemberRole.OWNER)
    ) {
      await this.departmentMemberCommandService.addMember(departmentId, {
        demoMemberId: activeDemoMember.id,
        jobTitle: JobTitle.SENIOR,
        role: DepartmentMemberRole.MANAGER,
      });
      deptMember = await this.departmentMemberQueryRepository.findById(
        departmentId,
        activeDemoMember.id,
      );
    }

    if (!deptMember) {
      throw new ForbiddenException(
        'errors.USER_IS_NOT_A_MEMBER_OF_THIS_DEPARTMENT',
      );
    }

    const activeDeptMember: ActiveDepartmentMemberData = {
      id: deptMember.id,
      userId: activeDemoMember.userId,
      demoId: activeDemoMember.demoId,
      departmentId: departmentId,
      role: deptMember.role as DepartmentMemberRole,
    };

    this.cls.set(CLS_KEYS.DEPARTMENT_MEMBER, activeDeptMember);

    const requiredRoles = this.reflector.getAllAndOverride<
      DepartmentMemberRole[]
    >(DepartmentRoles, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!requiredRoles.includes(activeDeptMember.role)) {
      throw new ForbiddenException(
        'errors.INSUFFICIENT_DEPARTMENT_PERMISSIONS',
      );
    }

    return true;
  }
}
