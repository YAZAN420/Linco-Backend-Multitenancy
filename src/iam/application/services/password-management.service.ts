import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import { GetUserByEmailQuery } from 'src/users/application/queries/get-user-by-email.query';
import { HashingPort } from '../ports/hashing.port';
import { CryptoPort } from '../ports/crypto.port';
import { MailQueueService } from './mail-queue.service';
import { MAIL_JOBS } from '../constants/mail.constants';
import { IAM_CONSTANTS } from '../../domain/constants/iam.constants';
import { InvalidResetTokenException } from '../../domain/exceptions';

@Injectable()
export class PasswordManagementService {
  constructor(
    private readonly hashingPort: HashingPort,
    private readonly cryptoPort: CryptoPort,
    private readonly usersCommandService: UsersCommandService,
    private readonly usersQueryService: UsersQueryService,
    private readonly mailQueueService: MailQueueService,
    private readonly logger: Logger,
  ) {}

  async forgotPassword(email: string) {
    const query = new GetUserByEmailQuery(email);
    const user = await this.usersQueryService.findByEmail(query);

    if (user) {
      const resetToken = this.cryptoPort.generateSecureToken();
      const hashedToken = this.cryptoPort.hashToken(resetToken);
      const resetExpires = new Date(
        Date.now() + IAM_CONSTANTS.RESET_TOKEN_EXPIRY_MS,
      );

      user.security.generatePasswordResetToken(hashedToken, resetExpires);
      await this.usersCommandService.save(user);

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
    const user = await this.usersQueryService.findByResetToken(hashedToken);

    if (!user) {
      throw new InvalidResetTokenException();
    }

    const hashedPassword = await this.hashingPort.hash(newPassword);
    user.security.resetPasswordWithToken(hashedPassword, hashedToken);
    await this.usersCommandService.save(user);

    this.logger.log(`Password reset successfully for user: ${user.id}`);
  }
}
