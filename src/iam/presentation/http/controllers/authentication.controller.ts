import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { User } from 'src/users/domain/user';
import { UserResponseMapper } from 'src/users/presentation/http/mappers/user-response.mapper';

import { AuthenticationService } from '../../../application/services/authentication.service';
import { TokenService } from '../../../application/services/token.service';

import { ActiveUser } from '../decorators/active-user.decorator';
import { IsWeb } from '../decorators/is-web.decorator';

import type { ActiveUserData } from '../../../domain/interfaces/active-user-data.interface';
import { GoogleUserData } from '../../../application/interfaces/google-user-data.interface';

import { SignUpDto } from '../dto/sign-up.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { GoogleMobileSignInDto } from '../dto/google-mobile-sign-in.dto';
import { RegistrationService } from '../../../application/services/registration.service';
import { Public } from '../decorators/public.decorator';
import { AuthCookieService } from '../services/auth-cookie.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { Verify2FADto } from '../dto/verify-2fa.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthState } from '../interfaces/sign-in-response.interface';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly registrationService: RegistrationService,
    private readonly tokenService: TokenService,
    private readonly cookieService: AuthCookieService,
    private readonly userResponseMapper: UserResponseMapper,
  ) {}

  @Public()
  @Post('sign-up')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async signUp(@Body() dto: SignUpDto) {
    await this.registrationService.signUp(dto);
    return {
      message: 'messages.REGISTRATION_SUCCESSFUL',
      data: null,
    };
  }

  @Public()
  @Post('sign-in')
  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async signIn(
    @Body() dto: SignInDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @IsWeb() isWeb: boolean,
  ) {
    const result = await this.authService.signIn(request.user as User);

    if (result.requires2FA) {
      return {
        message: 'messages.TWO_FACTOR_AUTHENTICATION_REQUIRED',
        data: {
          requires2FA: true,
          twoFactorToken: result.twoFactorToken,
        },
      };
    }

    if (isWeb) {
      this.cookieService.setAuthCookies(response, result.tokens!);
      return {
        message: 'messages.USER_SIGNED_IN_SUCCESSFULLY',
        data: {
          requires2FA: false,
          user: this.userResponseMapper.toResponseFromDomain(result.user!),
        },
      };
    }

    return {
      message: 'messages.USER_SIGNED_IN_SUCCESSFULLY',
      data: {
        requires2FA: false,
        user: this.userResponseMapper.toResponseFromDomain(result.user!),
        accessToken: result.tokens!.accessToken,
        refreshToken: result.tokens!.refreshToken,
      },
    };
  }

  @Public()
  @Post('sign-in/2fa')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async verify2FA(
    @Body() dto: Verify2FADto,
    @Res({ passthrough: true }) response: Response,
    @IsWeb() isWeb: boolean,
  ) {
    const userId = await this.tokenService.verifyTwoFactorToken(
      dto.twoFactorToken,
    );
    const result = await this.authService.verify2FaSignIn(userId, dto.tfaCode);

    if (isWeb) {
      this.cookieService.setAuthCookies(response, result.tokens!);
      return {
        message: 'messages.USER_SIGNED_IN_SUCCESSFULLY',
        data: {
          requires2FA: false,
          user: this.userResponseMapper.toResponseFromDomain(result.user!),
        },
      };
    }

    return {
      message: 'messages.USER_SIGNED_IN_SUCCESSFULLY',
      data: {
        requires2FA: false,
        user: this.userResponseMapper.toResponseFromDomain(result.user!),
        accessToken: result.tokens!.accessToken,
        refreshToken: result.tokens!.refreshToken,
      },
    };
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth(): void {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() request: Request, @Res() response: Response) {
    const googleUser = request.user as GoogleUserData | undefined;

    if (!googleUser?.email) {
      throw new UnauthorizedException('errors.GOOGLE_AUTHENTICATION_FAILED');
    }

    let redirectDomain = 'https://lincolms.me/home';
    if (request.query.state) {
      try {
        const parsedState = JSON.parse(
          request.query.state as string,
        ) as unknown as GoogleAuthState;
        if (parsedState.returnTo) {
          redirectDomain = parsedState.returnTo;
        }
      } catch (err) {
        console.log(err);
      }
    }

    const result = await this.authService.signInWithGoogle(googleUser);

    this.cookieService.setAuthCookies(response, result.tokens!);

    return response.redirect(redirectDomain);
  }

  @Public()
  @Post('google/mobile')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async googleMobileSignIn(@Body() dto: GoogleMobileSignInDto) {
    const result = await this.authService.signInWithGoogleIdToken(dto.idToken);

    return {
      message: 'messages.USER_SIGNED_IN_SUCCESSFULLY',
      data: {
        user: this.userResponseMapper.toResponseFromDomain(result.user!),
        accessToken: result.tokens!.accessToken,
        refreshToken: result.tokens!.refreshToken,
      },
    };
  }

  @Post('sign-out')
  async signOut(
    @ActiveUser() user: ActiveUserData,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.cookieService.clearAuthCookies(response);
    await this.authService.signOut(user.id);
    return { message: 'messages.USER_SIGNED_OUT_SUCCESSFULLY', data: null };
  }

  @Public()
  @Post('refresh-tokens')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
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
      throw new UnauthorizedException('errors.REFRESH_TOKEN_IS_REQUIRED');
    }

    const result = await this.tokenService.refreshTokens({ refreshToken });

    if (isWeb) {
      this.cookieService.setAuthCookies(response, result.tokens);
      return { message: 'messages.TOKENS_REFRESHED_SUCCESSFULLY', data: null };
    }

    return {
      message: 'messages.TOKENS_REFRESHED_SUCCESSFULLY',
      data: {
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
    };
  }
}
