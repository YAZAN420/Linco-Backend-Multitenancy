import { Injectable } from '@nestjs/common';
import { OTP } from 'otplib';
import { toDataURL } from 'qrcode';
import { Logger } from 'nestjs-pino';
import { ActiveUserData } from '../../domain/interfaces/active-user-data.interface';
import {
  Missing2FASecretException,
  Invalid2FACodeException,
} from '../../domain/exceptions';
import { UsersCommandService } from 'src/users/application/users-command.service';

@Injectable()
export class TwoFactorAuthService {
  private readonly otp = new OTP();

  constructor(
    private readonly usersCommandService: UsersCommandService,
    private readonly logger: Logger,
  ) {}
  async generateSecret(
    activeUser: ActiveUserData,
  ): Promise<{ qrCode: string }> {
    const userEmail = activeUser.email;
    const secret = this.otp.generateSecret();

    const otpauthUrl = this.otp.generateURI({
      label: userEmail,
      issuer: 'NestJS Server',
      secret,
    });

    await this.usersCommandService.setTwoFactorSecret(activeUser.id, secret);

    const qrCode = await toDataURL(otpauthUrl);
    this.logger.log(`2FA secret generated for user: ${activeUser.id}`);

    return { qrCode };
  }

  async turnOn(userId: string, code: string) {
    const user = await this.usersCommandService.findById(userId);
    const secret = user.security.twoFactorSecret;

    if (!secret) throw new Missing2FASecretException();

    const { valid } = await this.otp.verify({ token: code, secret });
    if (!valid) throw new Invalid2FACodeException();

    await this.usersCommandService.enableTwoFactorAuth(userId, secret);

    this.logger.log(`2FA enabled successfully for user: ${userId}`);
  }
}
