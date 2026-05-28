import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { CookieOptions, Response } from 'express';
import jwtConfig from 'src/config/jwt.config';
import { TokenPair } from '../../../domain/interfaces/token-pair.interface';

const REFRESH_TOKEN_PATH = '/authentication/refresh-tokens';

@Injectable()
export class AuthCookieService {
  private readonly baseCookieOptions: CookieOptions;

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    this.baseCookieOptions = {
      httpOnly: true,
      secure: this.jwtConfiguration.cookieSecure,
      sameSite: 'strict',
    };
  }

  setAuthCookies(response: Response, tokens: TokenPair): void {
    response.cookie('accessToken', tokens.accessToken, {
      ...this.baseCookieOptions,
      maxAge: this.jwtConfiguration.accessCookieMaxAge,
    });

    response.cookie('refreshToken', tokens.refreshToken, {
      ...this.baseCookieOptions,
      maxAge: this.jwtConfiguration.refreshCookieMaxAge,
      path: REFRESH_TOKEN_PATH,
    });
  }

  clearAuthCookies(response: Response): void {
    response.clearCookie('accessToken', this.baseCookieOptions);
    response.clearCookie('refreshToken', {
      ...this.baseCookieOptions,
      path: REFRESH_TOKEN_PATH,
    });
  }
}
