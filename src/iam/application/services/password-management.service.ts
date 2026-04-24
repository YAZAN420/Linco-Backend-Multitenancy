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
import { MessageResponse } from '../interfaces/message-response.interface';

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

  async forgotPassword(email: string): Promise<MessageResponse> {
    const query = new GetUserByEmailQuery(email);
    const user = await this.usersQueryService.findByEmail(query);

    if (user) {
      const resetToken = this.cryptoPort.generateSecureToken();
      const hashedToken = this.cryptoPort.hashToken(resetToken);
      const resetExpires = new Date(
        Date.now() + IAM_CONSTANTS.RESET_TOKEN_EXPIRY_MS,
      );

      user.generatePasswordResetToken(hashedToken, resetExpires);
      await this.usersCommandService.save(user);

      await this.mailQueueService.enqueue(
        MAIL_JOBS.SEND_PASSWORD_RESET_EMAIL,
        { email: user.getEmailValue(), token: resetToken },
        { priority: 1 },
      );

      this.logger.log(
        `Password reset token generated for user: ${user.getId()}`,
      );
    } else {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
      );
    }

    return {
      message:
        'If an account with that email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<MessageResponse> {
    const hashedToken = this.cryptoPort.hashToken(token);
    const user = await this.usersQueryService.findByResetToken(hashedToken);

    if (!user) {
      throw new InvalidResetTokenException();
    }

    const hashedPassword = await this.hashingPort.hash(newPassword);
    user.resetPasswordWithToken(hashedPassword, hashedToken);
    await this.usersCommandService.save(user);

    this.logger.log(`Password reset successfully for user: ${user.getId()}`);

    return { message: 'Password has been reset successfully.' };
  }
}
