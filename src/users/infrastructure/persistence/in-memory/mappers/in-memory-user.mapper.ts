import { User } from 'src/users/domain/user';
import { InMemoryUserEntity } from '../entities/user.entity';
import { Username } from 'src/users/domain/value-objects/username.vo';
import { Email } from 'src/users/domain/value-objects/email.vo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryUserMapper {
  toDomain(entity: InMemoryUserEntity): User {
    return new User(
      entity.id,
      new Username(entity.username),
      new Email(entity.email),
      entity.role,
      entity.password,
      entity.createdAt,
      entity.updatedAt,
      entity.isEmailVerified,
      entity.isTwoFactorAuthenticationEnabled,
      entity.refreshToken,
      entity.twoFactorAuthenticationSecret,
      entity.emailVerificationToken,
      entity.passwordResetToken,
      entity.passwordResetExpires,
    );
  }

  toPersistence(user: User): InMemoryUserEntity {
    return {
      id: user.getId(),
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
