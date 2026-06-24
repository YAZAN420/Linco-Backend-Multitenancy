import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SignUpDto } from 'src/iam/presentation/http/dto/sign-up.dto';
import { CryptoPort } from '../ports/crypto.port';
import { MailQueueService } from './mail-queue.service';
import { MAIL_JOBS } from '../constants/mail.constants';
import { Role } from 'src/users/domain/enums/role.enum';
import { UsersCommandService } from 'src/users/application/users-command.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly usersCommandService: UsersCommandService,
    private readonly cryptoPort: CryptoPort,
    private readonly mailQueueService: MailQueueService,
    private readonly logger: Logger,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const verificationToken = this.cryptoPort.generateSecureToken();
    const hashedToken = this.cryptoPort.hashToken(verificationToken);

    const newUser = await this.usersCommandService.create({
      ...signUpDto,
      role: Role.USER,
      isEmailVerified: false,
    });

    await this.usersCommandService.setVerificationToken(
      newUser.id,
      hashedToken,
    );

    await this.mailQueueService.enqueue(MAIL_JOBS.SEND_VERIFICATION_EMAIL, {
      email: signUpDto.email,
      token: verificationToken,
    });

    this.logger.log(`User registered: ${newUser.id}`);
  }

  async verifyEmail(token: string) {
    const hashedToken = this.cryptoPort.hashToken(token);
    const user =
      await this.usersCommandService.verifyEmailWithToken(hashedToken);
    this.logger.log(`Email verified for user: ${user.id}`);
  }
}
