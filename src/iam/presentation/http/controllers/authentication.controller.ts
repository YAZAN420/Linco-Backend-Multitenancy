import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { User } from 'src/users/domain/user';
import { UserResponseMapper } from 'src/users/presentation/http/mappers/user-response.mapper';

import { AuthenticationService } from '../../../application/services/authentication.service';
import { TokenService } from '../../../application/services/token.service';

import { ActiveUser } from '../decorators/active-user.decorator';
import { IsWeb } from '../decorators/is-web.decorator';
import {
  AuthGoogle,
  AuthGoogleCallback,
  AuthRefreshTokens,
  AuthSignIn,
  AuthSignUp,
} from '../decorators/authentication.decorators';
import type { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import type { SignInResult } from '../../../domain/interfaces/sign-in-result.interface';
import { GoogleUserData } from '../../../domain/interfaces/google-user-data.interface';

import { SignUpDto } from '../dto/sign-up.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { GoogleMobileSignInDto } from '../dto/google-mobile-sign-in.dto';
import { RegistrationService } from '../../../application/services/registration.service';
import { Public } from '../decorators/public.decorator';
import { AuthCookieService } from '../services/auth-cookie.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly registrationService: RegistrationService,
    private readonly tokenService: TokenService,
    private readonly cookieService: AuthCookieService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @AuthSignUp()
  signUp(@Body() dto: SignUpDto) {
    return this.registrationService.signUp(dto);
  }

  @AuthSignIn()
  async signIn(
    @Req() request: Request,
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
    @IsWeb() isWeb: boolean,
  ) {
    const result = await this.authService.signIn(
      request.user as User,
      dto.tfaCode,
    );

    if (isWeb) {
      this.cookieService.setAuthCookies(response, result.tokens);
      return {
        message: 'User signed in successfully',
        data: { user: this.userResponseMapper.toResponse(result.user) },
      };
    }

    return {
      message: 'User signed in successfully',
      data: {
        user: this.userResponseMapper.toResponse(result.user),
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
    };
  }

  @AuthGoogle()
  googleAuth(): void {}

  @AuthGoogleCallback()
  async googleCallback(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @IsWeb() isWeb: boolean,
  ) {
    const googleUser = request.user as GoogleUserData | undefined;

    if (!googleUser?.email) {
      throw new UnauthorizedException('Google authentication failed');
    }

    const result = await this.authService.signInWithGoogle(googleUser);

    if (isWeb) {
      this.cookieService.setAuthCookies(response, result.tokens);
      return {
        message: 'User signed in successfully',
        data: { user: this.userResponseMapper.toResponse(result.user) },
      };
    }

    return {
      message: 'User signed in successfully',
      data: {
        user: this.userResponseMapper.toResponse(result.user),
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
    };
  }

  @Public()
  @Post('google/mobile')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async googleMobileSignIn(@Body() dto: GoogleMobileSignInDto) {
    const signInWithGoogleIdToken =
      this.authService.signInWithGoogleIdToken.bind(this.authService) as (
        idToken: string,
      ) => Promise<SignInResult>;
    const result = await signInWithGoogleIdToken(dto.idToken);

    return {
      message: 'User signed in successfully',
      data: {
        user: this.userResponseMapper.toResponse(result.user),
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
    };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  signOut(
    @ActiveUser() user: ActiveUserData,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.cookieService.clearAuthCookies(response);
    return this.authService.signOut(user.id);
  }

  @AuthRefreshTokens()
  async refreshTokens(
    @Req() request: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
    @IsWeb() isWeb: boolean,
  ) {
    const cookies = request.cookies as Record<string, string>;
    const refreshToken: string | undefined = isWeb
      ? cookies?.refreshToken
      : dto.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const result = await this.tokenService.refreshTokens({ refreshToken });

    if (isWeb) {
      this.cookieService.setAuthCookies(response, result.tokens);
      return { message: 'Tokens refreshed successfully' };
    }

    return {
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
    };
  }
}
