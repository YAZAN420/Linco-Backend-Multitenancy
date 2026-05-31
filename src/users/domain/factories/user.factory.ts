import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.vo';
import { User } from '../user';
import { UserSecurity } from '../user-security';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class UserFactory {
  createNew(
    firstName: string,
    lastName: string,
    emailStr: string,
    passwordStr: string,
    birthDate: Date,
    imagePath: string,
  ): User {
    const email = new Email(emailStr);
    const now = new Date();

    const security = new UserSecurity({
      password: passwordStr,
      isEmailVerified: false,
      isTwoFactorEnabled: false,
      refreshToken: null,
      twoFactorSecret: null,
      emailVerificationToken: null,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    return new User(uuidv7(), {
      firstName,
      lastName,
      email,
      birthDate,
      imagePath,
      role: Role.USER,
      security,
      createdAt: now,
      updatedAt: now,
    });
  }
}
