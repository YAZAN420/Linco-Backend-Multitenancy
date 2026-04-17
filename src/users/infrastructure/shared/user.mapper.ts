import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { UserFactory } from 'src/users/domain/factories/user.factory';
import { UserPersistenceData } from 'src/users/domain/user-persistence.interface';

@Injectable()
export class UserMapper {
  constructor(private readonly userFactory: UserFactory) {}

  toDomain(raw: UserPersistenceData): User {
    return this.userFactory.reconstitute(raw);
  }

  toPersistence(user: User): UserPersistenceData {
    return {
      _id: user.getId(),
      username: user.getUsernameValue(),
      email: user.getEmailValue(),
      role: user.getRole(),
      password: user.getPasswordHash(),
      isEmailVerified: user.getIsEmailVerified(),
      isTwoFactorAuthenticationEnabled: user.getIsTwoFactorEnabled(),
      refreshToken: user.getRefreshToken(),
      twoFactorAuthenticationSecret: user.getTwoFactorSecret(),
      emailVerificationToken: user.getEmailVerificationToken(),
      passwordResetToken: user.getPasswordResetToken(),
      passwordResetExpires: user.getPasswordResetExpires(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
