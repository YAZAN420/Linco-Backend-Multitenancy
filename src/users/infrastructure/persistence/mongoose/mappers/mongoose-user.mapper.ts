import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { Username } from 'src/users/domain/value-objects/username.vo';
import { Email } from 'src/users/domain/value-objects/email.vo';
import { UserDocument } from '../schemas/user.schema';
import { UserMongoose } from '../schemas/user-mongoose.interface';

@Injectable()
export class MongooseUserMapper {
  toDomain(doc: UserDocument): User {
    return new User(
      doc._id,
      new Username(doc.username),
      new Email(doc.email),
      doc.role,
      doc.password,
      doc.createdAt ?? new Date(),
      doc.updatedAt ?? new Date(),
      doc.isEmailVerified,
      doc.isTwoFactorAuthenticationEnabled,
      doc.refreshToken ?? null,
      doc.twoFactorAuthenticationSecret ?? null,
      doc.emailVerificationToken ?? null,
      doc.passwordResetToken ?? null,
      doc.passwordResetExpires ?? null,
    );
  }

  toPersistence(user: User): UserMongoose {
    return {
      _id: user.getId(),
      username: user.getUsernameValue(),
      email: user.getEmailValue(),
      role: user.getRole(),
      password: user.getPasswordHash(),
      isEmailVerified: user.getIsEmailVerified(),
      isTwoFactorAuthenticationEnabled: user.getIsTwoFactorEnabled(),
      refreshToken: user.getRefreshToken()!,
      twoFactorAuthenticationSecret: user.getTwoFactorSecret()!,
      emailVerificationToken: user.getEmailVerificationToken()!,
      passwordResetToken: user.getPasswordResetToken()!,
      passwordResetExpires: user.getPasswordResetExpires()!,
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }
}
