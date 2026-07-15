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
import { DemoMemberRole } from 'src/generated/prisma/client';
import { DemoRoles } from '../decorators/demo-roles.decorator';

@Injectable()
export class DemoRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<AppClsStore>,
    private readonly authorizationQueryRepository: AuthorizationQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<DemoMemberRole[]>(
      DemoRoles,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!this.cls.isActive()) {
      throw new ForbiddenException('No active request context');
    }

    const user = this.cls.get(CLS_KEYS.USER);
    const demoId = this.cls.get(CLS_KEYS.DEMO_ID);

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    if (!demoId) {
      throw new ForbiddenException('Workspace context (x-demo-id) is missing');
    }

    const userRole = await this.authorizationQueryRepository.findDemoRole(
      user.id,
      demoId,
    );

    if (!userRole) {
      throw new ForbiddenException('User is not a member of this workspace');
    }

    const hasRole = requiredRoles.includes(userRole);
    if (!hasRole) {
      throw new ForbiddenException('Insufficient workspace permissions');
    }

    return true;
  }
}
