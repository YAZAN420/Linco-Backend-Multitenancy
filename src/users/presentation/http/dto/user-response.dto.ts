import { Role } from 'src/users/domain/enums/role.enum';

export class UserResponseDto {
  constructor(
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly birthDate: Date,
    readonly imagePath: string | null,
    readonly role: Role,
    readonly isEmailVerified: boolean,
    readonly isTwoFactorEnabled: boolean,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
