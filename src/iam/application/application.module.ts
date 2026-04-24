import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { HashingModule } from '../infrastructure/hashing/hashing.module';
import { TokenModule } from '../infrastructure/token/token.module';
import { CryptoModule } from '../infrastructure/crypto/crypto.module';
import { MailQueueModule } from '../infrastructure/mail-queue/mail-queue.module';

import { AuthenticationService } from './services/authentication.service';
import { RegistrationService } from './services/registration.service';
import { PasswordManagementService } from './services/password-management.service';
import { TwoFactorAuthService } from './services/two-factor-auth.service';
import { TokenService } from './services/token.service';
import { MailQueueService } from './services/mail-queue.service';

@Module({
  imports: [
    UsersModule,
    HashingModule,
    TokenModule,
    CryptoModule,
    MailQueueModule,
  ],
  providers: [
    AuthenticationService,
    RegistrationService,
    PasswordManagementService,
    TwoFactorAuthService,
    TokenService,
    MailQueueService,
  ],
  exports: [
    AuthenticationService,
    RegistrationService,
    PasswordManagementService,
    TwoFactorAuthService,
    TokenService,
  ],
})
export class IamApplicationModule {}
