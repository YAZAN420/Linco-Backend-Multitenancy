import { Injectable } from '@nestjs/common';
import { User as PrismaUser } from 'src/generated/prisma/client';
import { User } from 'src/users/domain/user';
import { UserSecurity } from 'src/users/domain/user-security';
import { Email } from 'src/users/domain/value-objects/email.vo';
import { Role } from 'src/users/domain/enums/role.enum';
import { UserStatus } from 'src/users/domain/enums/user-status.enum';

@Injectable()
export class PrismaUserMapper {
  toDomain(raw: PrismaUser): User {
    const security = new UserSecurity({
      password: raw.password,
      isEmailVerified: raw.isEmailVerified,
      isTwoFactorEnabled: raw.isTwoFactorEnabled,
      refreshToken: raw.refreshToken,
      twoFactorSecret: raw.twoFactorSecret,
      emailVerificationToken: raw.emailVerificationToken,
      emailVerificationExpires: raw.emailVerificationExpires,
      passwordResetToken: raw.passwordResetToken,
      passwordResetExpires: raw.passwordResetExpires,
    });

    return new User(raw.id, {
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: Email.fromPersistence(raw.email),
      birthDate: raw.birthDate,
      imagePath: raw.imagePath,
      role: raw.role as Role,
      status: raw.status as UserStatus,
      lastActiveAt: raw.lastActiveAt,
      security,
      stripeCustomerId: raw.stripeCustomerId ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(user: User): PrismaUser {
    const securityProps = user.security.propsData;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      lastActiveAt: user.lastActiveAt,
      stripeCustomerId: user.stripeCustomerId ?? null,
      birthDate: user.birthDate,
      imagePath: user.imagePath,
      password: securityProps.password,
      isEmailVerified: securityProps.isEmailVerified,
      isTwoFactorEnabled: securityProps.isTwoFactorEnabled,
      refreshToken: securityProps.refreshToken,
      twoFactorSecret: securityProps.twoFactorSecret,
      emailVerificationToken: securityProps.emailVerificationToken,
      emailVerificationExpires: securityProps.emailVerificationExpires,
      passwordResetToken: securityProps.passwordResetToken,
      passwordResetExpires: securityProps.passwordResetExpires,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
