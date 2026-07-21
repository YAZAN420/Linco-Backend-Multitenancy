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
import { DemoMemberQueryRepository } from 'src/demos/application/ports/demo-member/demo-member-query.repository';
import { ActiveDemoMemberData } from 'src/iam/domain/interfaces/active-demo-member.interface';
import { DemoMemberRole } from 'src/demos/domain/enums/demo-member-role.enum';
import { DemoRoles } from '../decorators/demo-roles.decorator';

@Injectable()
export class DemoRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cls: ClsService<AppClsStore>,
    private readonly demoMemberQueryRepository: DemoMemberQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const demoIdRaw = request.headers['x-demo-id'];
    const demoId = Array.isArray(demoIdRaw) ? demoIdRaw[0] : demoIdRaw;
    if (!demoId) {
      throw new ForbiddenException('Workspace context (x-demo-id) is missing');
    }

    const user = this.cls.get(CLS_KEYS.USER);
    if (!user) throw new ForbiddenException('User is not authenticated');

    const demoMember =
      await this.demoMemberQueryRepository.findDemoMemberByUserId(
        demoId,
        user.id,
      );

    if (!demoMember) {
      throw new ForbiddenException('User is not a member of this workspace');
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
      throw new ForbiddenException('Insufficient workspace permissions');
    }

    return true;
  }
}
