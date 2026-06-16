import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { HashingPort } from '../ports/hashing.port';
import { CryptoPort } from '../ports/crypto.port';
import { MailQueueService } from './mail-queue.service';
import { MAIL_JOBS } from '../constants/mail.constants';
import { IAM_CONSTANTS } from '../../domain/constants/iam.constants';
import { UsersCommandService } from 'src/users/application/users-command.service';

@Injectable()
export class PasswordManagementService {
  constructor(
    private readonly hashingPort: HashingPort,
    private readonly cryptoPort: CryptoPort,
    private readonly usersCommandService: UsersCommandService,
    private readonly mailQueueService: MailQueueService,
    private readonly logger: Logger,
  ) {}

  async forgotPassword(email: string) {
    const resetToken = this.cryptoPort.generateSecureToken();
    const hashedToken = this.cryptoPort.hashToken(resetToken);
    const resetExpires = new Date(
      Date.now() + IAM_CONSTANTS.RESET_TOKEN_EXPIRY_MS,
    );

    const user = await this.usersCommandService.setPasswordResetToken(
      email,
      hashedToken,
      resetExpires,
    );

    if (user) {
      await this.mailQueueService.enqueue(
        MAIL_JOBS.SEND_PASSWORD_RESET_EMAIL,
        { email: user.email, token: resetToken },
        { priority: 1 },
      );
      this.logger.log(`Password reset token generated for user: ${user.id}`);
    } else {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
      );
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = this.cryptoPort.hashToken(token);
    const hashedPassword = await this.hashingPort.hash(newPassword);

    const user = await this.usersCommandService.resetPassword(
      hashedToken,
      hashedPassword,
    );

    this.logger.log(`Password reset successfully for user: ${user.id}`);
  }
}
