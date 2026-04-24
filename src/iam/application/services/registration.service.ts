import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { UsersCommandService } from 'src/users/application/users-command.service';
import { UsersQueryService } from 'src/users/application/users-query.service';
import { CreateUserCommand } from 'src/users/application/commands/create-user.command';
import { SignUpDto } from 'src/iam/presentation/http/dto/sign-up.dto';
import { CryptoPort } from '../ports/crypto.port';
import { MailQueueService } from './mail-queue.service';
import { MAIL_JOBS } from '../constants/mail.constants';
import { InvalidVerificationTokenException } from '../../domain/exceptions';
import { MessageResponse } from '../interfaces/message-response.interface';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly usersCommandService: UsersCommandService,
    private readonly usersQueryService: UsersQueryService,
    private readonly cryptoPort: CryptoPort,
    private readonly mailQueueService: MailQueueService,
    private readonly logger: Logger,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<MessageResponse> {
    const verificationToken = this.cryptoPort.generateSecureToken();
    const hashedToken = this.cryptoPort.hashToken(verificationToken);

    const command = new CreateUserCommand(
      signUpDto.username,
      signUpDto.email,
      signUpDto.password,
    );

    const newUser = await this.usersCommandService.create(command);
    newUser.setVerificationToken(hashedToken);
    await this.usersCommandService.save(newUser);

    await this.mailQueueService.enqueue(MAIL_JOBS.SEND_VERIFICATION_EMAIL, {
      email: signUpDto.email,
      token: verificationToken,
    });

    this.logger.log(`User registered: ${newUser.getId()}`);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  async verifyEmail(token: string): Promise<MessageResponse> {
    const hashedToken = this.cryptoPort.hashToken(token);

    const user =
      await this.usersQueryService.findByVerificationToken(hashedToken);

    if (!user) {
      throw new InvalidVerificationTokenException();
    }

    user.verifyEmail(hashedToken);
    await this.usersCommandService.save(user);

    this.logger.log(`Email verified for user: ${user.getId()}`);

    return { message: 'Email verified successfully.' };
  }
}
