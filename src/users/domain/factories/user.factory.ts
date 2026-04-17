import { Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { Email } from '../value-objects/email.vo';
import { Username } from '../value-objects/username.vo';
import { User } from '../user';
import { UserPersistenceData } from '../user-persistence.interface';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class UserFactory {
  createNew(usernameStr: string, emailStr: string, passwordHash: string): User {
    const email = new Email(emailStr);
    const username = new Username(usernameStr);
    const now = new Date();

    return new User(
      uuidv7(),
      username,
      email,
      Role.Regular,
      passwordHash,
      now,
      now,
      false,
      false,
    );
  }

  reconstitute(data: UserPersistenceData): User {
    return new User(
      data._id,
      new Username(data.username),
      new Email(data.email),
      data.role,
      data.password,
      data.createdAt,
      data.updatedAt,
      data.isEmailVerified,
      data.isTwoFactorAuthenticationEnabled,
      data.refreshToken,
      data.twoFactorAuthenticationSecret,
      data.emailVerificationToken,
      data.passwordResetToken,
      data.passwordResetExpires,
    );
  }
}
