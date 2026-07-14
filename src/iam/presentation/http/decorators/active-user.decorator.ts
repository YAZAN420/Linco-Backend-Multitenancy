import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (_field: unknown, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: ActiveUserData }>();

    const user: ActiveUserData | undefined = request.user;

    return user;
  },
);
