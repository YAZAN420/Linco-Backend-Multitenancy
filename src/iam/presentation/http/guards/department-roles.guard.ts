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
import { AuthorizationQueryRepository } from '../../../application/ports/authorization-query.repository';
import { DepartmentMemberRole } from 'src/generated/prisma/client';
import { DepartmentRoles } from '../decorators/department-roles.decorator';

@Injectable()
export class DepartmentRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<AppClsStore>,
    private readonly authorizationQueryRepository: AuthorizationQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<
      DepartmentMemberRole[]
    >(DepartmentRoles, [context.getHandler(), context.getClass()]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!this.cls.isActive()) {
      throw new ForbiddenException('No active request context');
    }

    const user = this.cls.get(CLS_KEYS.USER);
    const demoId = this.cls.get(CLS_KEYS.DEMO_ID);
    const departmentId = this.cls.get(CLS_KEYS.DEPARTMENT_ID);

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    if (!demoId) {
      throw new ForbiddenException('Workspace context (x-demo-id) is missing');
    }

    if (!departmentId) {
      throw new ForbiddenException(
        'Department context (x-department-id) is missing',
      );
    }

    const userRole = await this.authorizationQueryRepository.findDepartmentRole(
      user.id,
      demoId,
      departmentId,
    );

    if (!userRole) {
      throw new ForbiddenException('User is not a member of this department');
    }

    const hasRole = requiredRoles.includes(userRole);
    if (!hasRole) {
      throw new ForbiddenException('Insufficient department permissions');
    }

    return true;
  }
}
