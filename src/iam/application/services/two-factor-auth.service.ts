import { Injectable } from '@nestjs/common';
import { OTP } from 'otplib';
import { toDataURL } from 'qrcode';
import { Logger } from 'nestjs-pino';
import { ActiveUserData } from '../../domain/interfaces/active-user-data.interface';
import {
  Missing2FASecretException,
  Invalid2FACodeException,
} from '../../domain/exceptions';
import { UsersService } from 'src/users/application/users.service';

@Injectable()
export class TwoFactorAuthService {
  private readonly otp = new OTP();

  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  async generateSecret(
    activeUser: ActiveUserData,
  ): Promise<{ qrCode: string }> {
    const user = await this.usersService.findById(activeUser.id);

    const secret = this.otp.generateSecret();
    const otpauthUrl = this.otp.generateURI({
      label: user.email,
      issuer: 'NestJS Server',
      secret,
    });

    user.security.setTwoFactorSecret(secret);
    await this.usersService.save(user);

    const qrCode = await toDataURL(otpauthUrl);
    this.logger.log(`2FA secret generated for user: ${activeUser.id}`);

    return { qrCode };
  }

  async turnOn(userId: string, code: string) {
    const user = await this.usersService.findById(userId);

    if (user.security.isTwoFactorEnabled) {
      throw new Error('Two-factor authentication is already enabled.');
    }

    const secret = user.security.twoFactorSecret;
    if (!secret) {
      throw new Missing2FASecretException();
    }

    const { valid } = await this.otp.verify({ token: code, secret });
    if (!valid) {
      throw new Invalid2FACodeException();
    }

    user.security.enableTwoFactorAuth(secret);
    await this.usersService.save(user);

    this.logger.log(`2FA enabled successfully for user: ${userId}`);
  }
}
