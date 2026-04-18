import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Res,
  Inject,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { Request, Response } from 'express';
import jwtConfig from 'src/config/jwt.config';
import { User } from 'src/users/domain/user';
import { UserResponseDto } from 'src/users/presentation/http/dto/user-response.dto';

import { AuthenticationService } from '../../application/services/authentication.service';
import { RegistrationService } from '../../application/services/registration.service';
import { PasswordManagementService } from '../../application/services/password-management.service';
import { TwoFactorAuthService } from '../../application/services/two-factor-auth.service';
import { TokenService } from '../../application/services/token.service';

import { ActiveUser } from './decorators/active-user.decorator';
import { Public } from './decorators/public.decorator';
import type { ActiveUserData } from '../../domain/interfaces/active-user-data.interface';

import {
  AuthRefreshTokens,
  AuthSignIn,
  AuthSignUp,
  AuthTurnOn2FA,
} from './decorators/authentication.decorators';

import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { TurnOn2FADto } from './dto/turn-on-2fa.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly registrationService: RegistrationService,
    private readonly passwordService: PasswordManagementService,
    private readonly twoFactorService: TwoFactorAuthService,
    private readonly tokenService: TokenService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
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
  ) {
    const isWeb = request.headers['user-agent']?.includes('Mozilla');
    const result = await this.authService.signIn(
      request.user as User,
      dto.tfaCode,
    );

    if (isWeb) {
      this.setAuthCookies(
        response,
        result.tokens.accessToken,
        result.tokens.refreshToken,
      );

      return {
        message: 'User signed in successfully',
        data: {
          user: UserResponseDto.from(result.user),
        },
      };
    }

    return {
      message: 'User signed in successfully',
      data: {
        user: UserResponseDto.from(result.user),
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
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken', {
      path: '/authentication/refresh-tokens',
    });
    return this.authService.signOut(user.id);
  }

  @AuthRefreshTokens()
  async refreshTokens(
    @Req() request: Request,
    @Body() dto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const isWeb = request.headers['user-agent']?.includes('Mozilla');
    const cookies = request.cookies as Record<string, string>;
    const refreshToken: string | undefined = isWeb
      ? cookies?.refreshToken
      : dto.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const result = await this.tokenService.refreshTokens({ refreshToken });

    if (isWeb) {
      this.setAuthCookies(
        response,
        result.tokens.accessToken,
        result.tokens.refreshToken,
      );

      return {
        message: 'Tokens refreshed successfully',
      };
    }

    return {
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
    };
  }

  @Post('2fa/generate')
  generateQrCode(@ActiveUser() user: ActiveUserData) {
    return this.twoFactorService.generateSecret(user);
  }

  @AuthTurnOn2FA()
  turnOnTwoFactorAuthentication(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: TurnOn2FADto,
  ) {
    return this.twoFactorService.turnOn(user.id, dto.tfaCode);
  }

  @Public()
  @Get('verify-email')
  verifyEmail(@Query() dto: VerifyEmailDto) {
    return this.registrationService.verifyEmail(dto.token);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.passwordService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.passwordService.resetPassword(dto.token, dto.password);
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.jwtConfiguration.cookieSecure,
      sameSite: 'strict',
      maxAge: this.jwtConfiguration.accessCookieMaxAge,
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.jwtConfiguration.cookieSecure,
      sameSite: 'strict',
      maxAge: this.jwtConfiguration.refreshCookieMaxAge,
      path: '/authentication/refresh-tokens',
    });
  }
}
