import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { HashingPort } from '../ports/hashing.port';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import { GetUserByEmailQuery } from 'src/users/application/queries/get-user-by-email.query';
import { InvalidResetTokenException } from '../../domain/exceptions';
import { IAM_CONSTANTS, MAIL_JOBS } from '../../domain/constants/iam.constants';
import { Logger } from 'nestjs-pino';

@Injectable()
export class PasswordManagementService {
  constructor(
    private readonly hashingPort: HashingPort,
    private readonly usersCommandService: UsersCommandService,
    private readonly usersQueryService: UsersQueryService,
    @InjectQueue(IAM_CONSTANTS.MAIL_QUEUE)
    private readonly mailQueue: Queue,
    private readonly logger: Logger,
  ) {}

  async forgotPassword(email: string): Promise<{ message: string }> {
    const query = new GetUserByEmailQuery(email);
    const user = await this.usersQueryService.findByEmail(query);

    if (user) {
      const resetToken = this.generateSecureToken();
      const hashedToken = this.hashToken(resetToken);
      const resetExpires = new Date(
        Date.now() + IAM_CONSTANTS.RESET_TOKEN_EXPIRY_MS,
      );

      user.generatePasswordResetToken(hashedToken, resetExpires);
      await this.usersCommandService.save(user);

      await this.enqueuePasswordResetEmail(user.getEmailValue(), resetToken);

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
  ): Promise<{ message: string }> {
    const hashedToken = this.hashToken(token);

    const user = await this.usersQueryService.findByResetToken(hashedToken);

    if (!user) {
      throw new InvalidResetTokenException();
    }

    const hashedPassword = await this.hashingPort.hash(newPassword);

    user.resetPasswordWithToken(hashedPassword, hashedToken);
    await this.usersCommandService.save(user);

    this.logger.log(`Password  successfully for user: ${user.getId()}`);

    return { message: 'Password has been reset successfully.' };
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(IAM_CONSTANTS.TOKEN_BYTES).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async enqueuePasswordResetEmail(
    email: string,
    token: string,
  ): Promise<void> {
    await this.mailQueue.add(
      MAIL_JOBS.SEND_PASSWORD_RESET_EMAIL,
      { email, token },
      {
        priority: 1,
        attempts: IAM_CONSTANTS.MAIL_RETRY_ATTEMPTS,
        backoff: {
          type: 'exponential',
          delay: IAM_CONSTANTS.MAIL_RETRY_DELAY_MS,
        },
        removeOnComplete: true,
      },
    );
  }
}
