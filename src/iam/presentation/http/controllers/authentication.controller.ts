import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { SignInDto } from '../dto/sign-in.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { GoogleMobileSignInDto } from '../dto/google-mobile-sign-in.dto';
import { RegistrationService } from '../../../application/services/registration.service';
import { Public } from '../decorators/public.decorator';
import { AuthCookieService } from '../services/auth-cookie.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';

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
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async signUp(@Body() dto: SignUpDto) {
    await this.registrationService.signUp(dto);
    return {
      message:
        'Registration successful. Please check your email to verify your account.',
      data: null,
    };
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async signIn(
    @Req() request: Request,
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
    @IsWeb() isWeb: boolean,
  ) {
    const result = await this.authService.signIn(request.user as User);

    if (isWeb) {
      this.cookieService.setAuthCookies(response, result.tokens);
      return {
        message: 'User signed in successfully',
        data: {
          user: this.userResponseMapper.toResponseFromDomain(result.user),
        },
      };
    }

    return {
      message: 'User signed in successfully',
      data: {
        user: this.userResponseMapper.toResponseFromDomain(result.user),
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
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
      throw new UnauthorizedException('Google authentication failed');
    }

    const result = await this.authService.signInWithGoogle(googleUser);

    this.cookieService.setAuthCookies(response, result.tokens);

    return response.redirect('https://lincolms.me/home');
  }

  @Public()
  @Post('google/mobile')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async googleMobileSignIn(@Body() dto: GoogleMobileSignInDto) {
    const result = await this.authService.signInWithGoogleIdToken(dto.idToken);

    return {
      message: 'User signed in successfully',
      data: {
        user: this.userResponseMapper.toResponseFromDomain(result.user),
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
      },
    };
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  async signOut(
    @ActiveUser() user: ActiveUserData,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.cookieService.clearAuthCookies(response);
    await this.authService.signOut(user.id);
    return { message: 'User signed out successfully', data: null };
  }

  @Public()
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
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
      throw new UnauthorizedException('Refresh token is required');
    }

    const result = await this.tokenService.refreshTokens({ refreshToken });

    if (isWeb) {
      this.cookieService.setAuthCookies(response, result.tokens);
      return { message: 'Tokens refreshed successfully', data: null };
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
