import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    let returnTo = req.query.redirectUrl as string;

    if (!returnTo) {
      const referer = req.get('referer');
      const isAuthPage =
        referer &&
        (referer.includes('/signin') ||
          referer.includes('/login') ||
          referer.includes('/sign-up'));

      if (referer && !isAuthPage) {
        returnTo = referer;
      } else {
        returnTo = 'https://lincolms.me/home';
      }
    }

    return {
      state: JSON.stringify({ returnTo: origin }),
    };
  }
}
