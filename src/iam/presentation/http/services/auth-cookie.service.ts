import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { Response } from 'express';
import jwtConfig from 'src/config/jwt.config';
import { TokenPair } from '../../../domain/interfaces/token-pair.interface';

const REFRESH_TOKEN_PATH = '/authentication/refresh-tokens';

@Injectable()
export class AuthCookieService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  setAuthCookies(response: Response, tokens: TokenPair): void {
    response.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: this.jwtConfiguration.cookieSecure,
      sameSite: 'strict',
      maxAge: this.jwtConfiguration.accessCookieMaxAge,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: this.jwtConfiguration.cookieSecure,
      sameSite: 'strict',
      maxAge: this.jwtConfiguration.refreshCookieMaxAge,
      path: REFRESH_TOKEN_PATH,
    });
  }

  clearAuthCookies(response: Response): void {
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken', { path: REFRESH_TOKEN_PATH });
  }
}
