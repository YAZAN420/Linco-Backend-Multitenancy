import { Injectable } from '@nestjs/common';
import {
  UserPublicResponseDto,
  UserResponseDto,
} from '../dto/user-response.dto';
import { User as PrismaUser } from 'src/generated/prisma/client';
import { User as DomainUser } from 'src/users/domain/user';
import { Role } from 'src/users/domain/enums/role.enum';
import { UserStatus } from 'src/users/domain/enums/user-status.enum';
import { maskEmail } from 'src/common/utils/string.util';

@Injectable()
export class UserResponseMapper {
  toResponseFromPrisma(user: PrismaUser): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imagePath: user.imagePath,
      email: user.email,
      birthDate: user.birthDate,
      role: user.role as Role,
      status: user.status as UserStatus,
      lastActiveAt: user.lastActiveAt,
      isEmailVerified: user.isEmailVerified,
      isTwoFactorEnabled: user.isTwoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  toPublicResponseFromPrisma(user: PrismaUser): UserPublicResponseDto {
    return new UserPublicResponseDto({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: maskEmail(user.email),
      imagePath: user.imagePath,
      status: user.status as UserStatus,
      lastActiveAt: user.lastActiveAt,
    });
  }

  toResponseFromDomain(user: DomainUser): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      imagePath: user.imagePath,
      email: user.email,
      birthDate: user.birthDate,
      role: user.role,
      status: user.status,
      lastActiveAt: user.lastActiveAt,
      isEmailVerified: user.security.isEmailVerified,
      isTwoFactorEnabled: user.security.isTwoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  toResponseManyFromPrisma(
    users: PrismaUser[],
    role: Role,
  ): UserPublicResponseDto[] | UserResponseDto[] {
    if (role === Role.ADMIN) {
      return users.map((user) => this.toResponseFromPrisma(user));
    }
    return users.map((user) => this.toPublicResponseFromPrisma(user));
  }
}
