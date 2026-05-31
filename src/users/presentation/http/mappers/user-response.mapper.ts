import { Injectable } from '@nestjs/common';
import { UserResponseDto } from '../dto/user-response.dto';
import { User as PrismaUser } from 'src/generated/prisma/browser';
import { User as DomainUser } from 'src/users/domain/user';

@Injectable()
export class UserResponseMapper {
  toResponseFromPrisma(user: PrismaUser): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.birthDate,
      user.imagePath,
      user.role as unknown as DomainUser['role'],
      user.isEmailVerified,
      user.isTwoFactorEnabled,
      user.createdAt,
      user.updatedAt,
    );
  }

  toResponseFromDomain(user: DomainUser): UserResponseDto {
    return new UserResponseDto(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.birthDate,
      user.imagePath,
      user.role,
      user.security.isEmailVerified,
      user.security.isTwoFactorEnabled,
      user.createdAt,
      user.updatedAt,
    );
  }

  toResponseManyFromPrisma(users: PrismaUser[]): UserResponseDto[] {
    return users.map((user) => this.toResponseFromPrisma(user));
  }
}
