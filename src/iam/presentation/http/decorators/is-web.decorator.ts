import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const IsWeb = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const clientType = request.headers['x-client-type'];

    if (clientType && typeof clientType === 'string') {
      return clientType.toLowerCase() === 'web';
    }
    return false;
  },
);
