import { Role } from 'src/users/domain/enums/role.enum';

export class CreateUserCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly birthDate: Date,
    public readonly imagePath: string,
    public readonly role: Role,
  ) {}
}
