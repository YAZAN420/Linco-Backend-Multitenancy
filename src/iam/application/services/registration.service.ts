import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import { CreateUserCommand } from 'src/users/application/commands/create-user.command';
import { SignUpDto } from 'src/iam/presentation/http/dto/sign-up.dto';
import { IAM_CONSTANTS, MAIL_JOBS } from '../../domain/constants/iam.constants';

@Injectable()
export class RegistrationService {
  private readonly logger = new Logger(RegistrationService.name);

  constructor(
    private readonly usersCommandService: UsersCommandService,
    private readonly usersQueryService: UsersQueryService,
    @InjectQueue(IAM_CONSTANTS.MAIL_QUEUE)
    private readonly mailQueue: Queue,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    const verificationToken = this.generateSecureToken();
    const hashedToken = this.hashToken(verificationToken);

    const command = new CreateUserCommand(
      signUpDto.username,
      signUpDto.email,
      signUpDto.password,
    );

    const newUser = await this.usersCommandService.create(command);

    newUser.setVerificationToken(hashedToken);
    await this.usersCommandService.save(newUser);

    await this.enqueueVerificationEmail(signUpDto.email, verificationToken);

    this.logger.log(`User registered successfully: ${signUpDto.email}`);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const hashedToken = this.hashToken(token);

    const user =
      await this.usersQueryService.findByVerificationToken(hashedToken);

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.verifyEmail(hashedToken);
    await this.usersCommandService.save(user);

    this.logger.log(`Email verified for user: ${user.getId()}`);

    return { message: 'Email verified successfully.' };
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(IAM_CONSTANTS.TOKEN_BYTES).toString('hex');
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async enqueueVerificationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    await this.mailQueue.add(
      MAIL_JOBS.SEND_VERIFICATION_EMAIL,
      { email, token },
      {
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
