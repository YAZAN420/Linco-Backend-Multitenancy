import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';
import { AppClsStore } from 'src/common/interfaces/app-cls-store.interface';
import { Request } from 'express';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';
import { DemoMembersQueryService } from 'src/demos/application/demo-member/demo-members-query.service';
import { ActiveDemoMemberData } from 'src/iam/domain/interfaces/active-demo-member.interface';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { DemoRoles } from '../decorators/demo-roles.decorator';

@Injectable()
export class DemoRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<AppClsStore>,
    private readonly demoMembersQueryService: DemoMembersQueryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const demoIdRaw = request.headers['x-demo-id'];
    const demoId = Array.isArray(demoIdRaw) ? demoIdRaw[0] : demoIdRaw;
    if (!demoId) {
      throw new ForbiddenException(
        'errors.WORKSPACE_CONTEXT_X_DEMO_ID_IS_MISSING',
      );
    }

    const user = this.cls.get(CLS_KEYS.USER);
    if (!user) throw new ForbiddenException('errors.USER_IS_NOT_AUTHENTICATED');

    const demoMember = await this.demoMembersQueryService.findByUserId(
      demoId,
      user.id,
    );

    if (!demoMember) {
      throw new ForbiddenException(
        'errors.USER_IS_NOT_A_MEMBER_OF_THIS_WORKSPACE',
      );
    }

    const activeDemoMember: ActiveDemoMemberData = {
      id: demoMember.id,
      userId: user.id,
      demoId: demoId,
      role: demoMember.role as DemoMemberRole,
    };

    this.cls.set(CLS_KEYS.DEMO_MEMBER, activeDemoMember);

    const requiredRoles = this.reflector.getAllAndOverride<DemoMemberRole[]>(
      DemoRoles,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    if (!requiredRoles.includes(activeDemoMember.role)) {
      throw new ForbiddenException('errors.INSUFFICIENT_WORKSPACE_PERMISSIONS');
    }

    return true;
  }
}
