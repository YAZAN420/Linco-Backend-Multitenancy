import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserResponseMapper {
  toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate,
      imagePath: user.imagePath,
      role: user.role,
      isEmailVerified: user.security.isEmailVerified,
      isTwoFactorEnabled: user.security.isTwoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  toResponseMany(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
