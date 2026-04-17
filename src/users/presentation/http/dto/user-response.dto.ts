import { User } from 'src/users/domain/user';

export class UserResponseDto {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly role: string;
  readonly isEmailVerified: boolean;
  readonly isTwoFactorEnabled: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(user: User) {
    this.id = user.getId();
    this.username = user.getUsernameValue();
    this.email = user.getEmailValue();
    this.role = user.getRole();
    this.isEmailVerified = user.getIsEmailVerified();
    this.isTwoFactorEnabled = user.getIsTwoFactorEnabled();
    this.createdAt = user.getCreatedAt();
    this.updatedAt = user.getUpdatedAt();
  }

  static from(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }

  static fromMany(users: User[]): UserResponseDto[] {
    return users.map((u) => UserResponseDto.from(u));
  }
}
