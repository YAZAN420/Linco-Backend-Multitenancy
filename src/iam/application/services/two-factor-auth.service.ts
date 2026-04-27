import { Injectable } from '@nestjs/common';
import { OTP } from 'otplib';
import { toDataURL } from 'qrcode';
import { Logger } from 'nestjs-pino';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import { GetUserByIdQuery } from 'src/users/application/queries/get-user-by-id.query';
import { ActiveUserData } from '../../domain/interfaces/active-user-data.interface';
import {
  Missing2FASecretException,
  Invalid2FACodeException,
} from '../../domain/exceptions';
import { MessageResponse } from '../interfaces/message-response.interface';

@Injectable()
export class TwoFactorAuthService {
  private readonly otp = new OTP();

  constructor(
    private readonly usersCommandService: UsersCommandService,
    private readonly usersQueryService: UsersQueryService,
    private readonly logger: Logger,
  ) {}

  async generateSecret(
    activeUser: ActiveUserData,
  ): Promise<{ qrCode: string }> {
    const query = new GetUserByIdQuery(activeUser.id);
    const user = await this.usersQueryService.findById(query);

    const secret = this.otp.generateSecret();
    const otpauthUrl = this.otp.generateURI({
      label: user.getEmailValue(),
      issuer: 'NestJS Server',
      secret,
    });

    user.setTwoFactorSecret(secret);
    await this.usersCommandService.save(user);

    const qrCode = await toDataURL(otpauthUrl);
    this.logger.log(`2FA secret generated for user: ${activeUser.id}`);

    return { qrCode };
  }

  async turnOn(userId: string, code: string): Promise<MessageResponse> {
    const query = new GetUserByIdQuery(userId);
    const user = await this.usersQueryService.findById(query);

    const secret = user.getTwoFactorSecret();
    if (!secret) {
      throw new Missing2FASecretException();
    }

    const { valid } = await this.otp.verify({ token: code, secret });
    if (!valid) {
      throw new Invalid2FACodeException();
    }

    user.enableTwoFactorAuth(secret);
    await this.usersCommandService.save(user);

    this.logger.log(`2FA enabled successfully for user: ${userId}`);

    return { message: 'Two-factor authentication successfully enabled' };
  }
}
