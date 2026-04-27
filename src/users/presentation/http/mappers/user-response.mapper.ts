import { Injectable } from '@nestjs/common';
import { User } from 'src/users/domain/user';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserResponseMapper {
  toResponse(user: User): UserResponseDto {
    return {
      id: user.getId(),
      username: user.getUsernameValue(),
      email: user.getEmailValue(),
      role: user.getRole(),
      isEmailVerified: user.getIsEmailVerified(),
      isTwoFactorEnabled: user.getIsTwoFactorEnabled(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    };
  }

  toResponseMany(users: User[]): UserResponseDto[] {
    return users.map((user) => this.toResponse(user));
  }
}
