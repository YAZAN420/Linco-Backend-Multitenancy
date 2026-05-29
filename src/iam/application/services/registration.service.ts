import { Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { SignUpDto } from 'src/iam/presentation/http/dto/sign-up.dto';
import { CryptoPort } from '../ports/crypto.port';
import { MailQueueService } from './mail-queue.service';
import { MAIL_JOBS } from '../constants/mail.constants';
import { InvalidVerificationTokenException } from '../../domain/exceptions';
import { Role } from 'src/users/domain/enums/role.enum';
import { UsersService } from 'src/users/application/users.service';

@Injectable()
export class RegistrationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoPort: CryptoPort,
    private readonly mailQueueService: MailQueueService,
    private readonly logger: Logger,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const verificationToken = this.cryptoPort.generateSecureToken();
    const hashedToken = this.cryptoPort.hashToken(verificationToken);

    const newUser = await this.usersService.create({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      password: signUpDto.password,
      birthDate: signUpDto.birthDate,
      imagePath: signUpDto.imagePath,
      role: Role.USER,
    });
    newUser.security.setVerificationToken(hashedToken);
    await this.usersService.save(newUser);

    await this.mailQueueService.enqueue(MAIL_JOBS.SEND_VERIFICATION_EMAIL, {
      email: signUpDto.email,
      token: verificationToken,
    });

    this.logger.log(`User registered: ${newUser.id}`);
  }

  async verifyEmail(token: string) {
    const hashedToken = this.cryptoPort.hashToken(token);

    const user = await this.usersService.findByVerificationToken(hashedToken);

    if (!user) {
      throw new InvalidVerificationTokenException();
    }

    user.security.verifyEmail(hashedToken);
    await this.usersService.save(user);

    this.logger.log(`Email verified for user: ${user.id}`);
  }
}
