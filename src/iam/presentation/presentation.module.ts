import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import jwtConfig from 'src/common/config/jwt.config';
import googleOAuthConfig from 'src/common/config/google-oauth.config';

import { IamApplicationModule } from '../application/application.module';

import { JwtStrategy } from '../infrastructure/authentication/strategies/jwt.strategy';
import { LocalStrategy } from '../infrastructure/authentication/strategies/local.strategy';
import { GoogleStrategy } from '../infrastructure/authentication/strategies/google.strategy';

import { AuthenticationController } from './http/controllers/authentication.controller';
import { TwoFactorAuthController } from './http/controllers/two-factor-auth.controller';
import { PasswordController } from './http/controllers/password.controller';
import { EmailVerificationController } from './http/controllers/email-verification.controller';

import { AccessTokenGuard } from './http/guards/access-token.guard';
import { RolesGuard } from './http/guards/roles.guard';
import { AuthCookieService } from './http/services/auth-cookie.service';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(googleOAuthConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    IamApplicationModule,
  ],
  controllers: [
    AuthenticationController,
    TwoFactorAuthController,
    PasswordController,
    EmailVerificationController,
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    GoogleStrategy,
    AuthCookieService,
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class IamPresentationModule {}
