import { Role } from 'src/users/domain/enums/role.enum';
import { UserStatus } from 'src/users/domain/enums/user-status.enum';

export class UserPublicResponseDto {
  readonly id!: string;
  readonly firstName!: string;
  readonly lastName!: string;
  readonly email!: string;
  readonly imagePath!: string | null;
  readonly status!: UserStatus;
  readonly lastActiveAt!: Date | null;

  constructor(partial: Partial<UserPublicResponseDto>) {
    Object.assign(this, partial);
  }
}

export class UserResponseDto extends UserPublicResponseDto {
  readonly birthDate!: Date | null;
  readonly role!: Role;
  readonly isEmailVerified!: boolean;
  readonly isTwoFactorEnabled!: boolean;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  constructor(partial: Partial<UserResponseDto>) {
    super(partial);
    Object.assign(this, partial);
  }
}
