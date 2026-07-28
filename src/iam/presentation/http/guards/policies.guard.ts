import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClsService } from 'nestjs-cls';

import { CheckPolicies } from '../decorators/check-policies.decorator';
import { AuthorizationPort } from '../../../application/ports/authorization.port';
import { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { PolicyHandler } from '../interfaces/policy-handler.interface';
import { AppClsStore } from 'src/common/interfaces/app-cls-store.interface';
import { CLS_KEYS } from 'src/common/constants/cls-keys.constant';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorizationPort: AuthorizationPort,
    private readonly cls: ClsService<AppClsStore>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const policyHandlers =
      this.reflector.getAllAndOverride<PolicyHandler[]>(CheckPolicies, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (!policyHandlers.length) {
      return true;
    }

    let user: ActiveUserData | undefined;

    if (this.cls.isActive()) {
      user = this.cls.get<ActiveUserData>(CLS_KEYS.USER);
    }

    if (!user) {
      throw new ForbiddenException('errors.USER_NOT_AUTHENTICATED');
    }

    const isAllowed = policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, user),
    );

    if (!isAllowed) {
      throw new ForbiddenException(
        'errors.YOU_DO_NOT_HAVE_PERMISSION_TO_PERFORM_THIS_ACTION',
      );
    }

    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, user: ActiveUserData) {
    if (typeof handler === 'function') {
      return handler(this.authorizationPort, user);
    }
    return handler.handle(this.authorizationPort, user);
  }
}
