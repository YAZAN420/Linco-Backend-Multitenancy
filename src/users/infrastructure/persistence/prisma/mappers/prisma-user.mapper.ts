import { Injectable } from '@nestjs/common';
import {
  User as PrismaUser,
  Role as PrismaRole,
} from 'src/generated/prisma/client';
import { User } from 'src/users/domain/user';
import { Username } from 'src/users/domain/value-objects/username.vo';
import { Email } from 'src/users/domain/value-objects/email.vo';
import { Role } from 'src/users/domain/enums/role.enum';

@Injectable()
export class PrismaUserMapper {
  toDomain(raw: PrismaUser): User {
    return new User(
      raw.id,
      new Username(raw.username),
      new Email(raw.email),
      raw.role as Role,
      raw.password,
      raw.createdAt,
      raw.updatedAt,
      raw.isEmailVerified,
      raw.isTwoFactorAuthenticationEnabled,
      raw.refreshToken,
      raw.twoFactorAuthenticationSecret,
      raw.emailVerificationToken,
      raw.passwordResetToken,
      raw.passwordResetExpires,
    );
  }

  toPersistence(user: User): PrismaUser {
    return {
      id: user.getId(),
      username: user.getUsernameValue(),
      email: user.getEmailValue(),
      role: user.getRole() as unknown as PrismaRole,
      password: user.getPassword(),
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
