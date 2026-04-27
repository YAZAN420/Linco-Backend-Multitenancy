export class UserResponseDto {
  declare readonly id: string;
  declare readonly username: string;
  declare readonly email: string;
  declare readonly role: string;
  declare readonly isEmailVerified: boolean;
  declare readonly isTwoFactorEnabled: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}
