import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import jwtConfig from 'src/config/jwt.config';
import { UsersModule } from 'src/users/users.module';

import { AuthenticationService } from './application/services/authentication.service';
import { RegistrationService } from './application/services/registration.service';
import { PasswordManagementService } from './application/services/password-management.service';
import { TwoFactorAuthService } from './application/services/two-factor-auth.service';
import { TokenService } from './application/services/token.service';
import { MailProcessor } from './application/processors/mail.processor';

import { HashingModule } from './infrastructure/hashing/hashing.module';
import { TokenModule } from './infrastructure/token/token.module';
import { CaslModule } from './infrastructure/authorization/casl/casl.module';
import { JwtStrategy } from './infrastructure/authentication/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/authentication/strategies/local.strategy';

import { AuthenticationController } from './presentation/http/authentication.controller';
import { AccessTokenGuard } from './presentation/http/guards/access-token.guard';
import { RolesGuard } from './presentation/http/guards/roles.guard';

import { IAM_CONSTANTS } from './domain/constants/iam.constants';
import { MailModule } from 'src/core/mail/mail.module';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: (jwtConfiguration: ConfigType<typeof jwtConfig>) => ({
        secret: jwtConfiguration.secret,
        signOptions: {
          audience: jwtConfiguration.audience,
          issuer: jwtConfiguration.issuer,
          expiresIn: jwtConfiguration.accessTokenTtl,
        },
      }),
      inject: [jwtConfig.KEY],
    }),
    HashingModule,
    TokenModule,
    CaslModule,
    MailModule,
    UsersModule,
    BullModule.registerQueue({
      name: IAM_CONSTANTS.MAIL_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: IAM_CONSTANTS.MAIL_QUEUE,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    RegistrationService,
    PasswordManagementService,
    TwoFactorAuthService,
    TokenService,

    JwtStrategy,
    LocalStrategy,

    MailProcessor,

    { provide: APP_GUARD, useClass: AccessTokenGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
  exports: [
    ConfigModule,
    JwtModule,
    HashingModule,
    TokenModule,
    CaslModule,
    AuthenticationService,
    TokenService,
    BullModule,
  ],
})
export class IamModule {}
