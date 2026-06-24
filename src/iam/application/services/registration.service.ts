import { BadRequestException, Injectable } from '@nestjs/common';
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

    const expiresInMilliseconds = 15 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresInMilliseconds);

    const newUser = await this.usersCommandService.create({
      ...signUpDto,
      role: Role.USER,
      isEmailVerified: false,
    });

    await this.usersCommandService.setVerificationToken(
      newUser.id,
      hashedToken,
      expiresAt,
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

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.usersCommandService.findByEmail(email);

    if (!user || user.security.isEmailVerified) {
      throw new BadRequestException('User already verified or does not exist');
    }
    const verificationToken = this.cryptoPort.generateSecureToken();
    const hashedToken = this.cryptoPort.hashToken(verificationToken);

    const expiresInMilliseconds = 15 * 60 * 1000;
    const expiresAt = new Date(Date.now() + expiresInMilliseconds);

    await this.usersCommandService.setVerificationToken(
      user.id,
      hashedToken,
      expiresAt,
    );

    await this.mailQueueService.enqueue(MAIL_JOBS.SEND_VERIFICATION_EMAIL, {
      email: email,
      token: verificationToken,
    });

    this.logger.log(`New Email verification token sent for user: ${user.id}`);
  }
}
