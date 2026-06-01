import { Role } from './enums/role.enum';
import { Email } from './value-objects/email.vo';
import { UserSecurity } from './user-security';
import { UserProps } from './interfaces/user.props';

export class User {
  constructor(
    public readonly id: string,
    private readonly props: UserProps,
  ) {}

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): string {
    return this.props.email.getValue();
  }

  get emailVO(): Email {
    return this.props.email;
  }

  get birthDate(): Date {
    return this.props.birthDate;
  }

  get imagePath(): string {
    return this.props.imagePath;
  }

  get role(): Role {
    return this.props.role;
  }

  get security(): UserSecurity {
    return this.props.security;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  delete(): void {
    if (this.deletedAt) {
      throw new Error('User is already deleted');
    }
    this.props.deletedAt = new Date();
  }

  changeFirstName(newFirstName: string): void {
    this.props.firstName = newFirstName;
    this.touch();
  }

  changeLastName(newLastName: string): void {
    this.props.lastName = newLastName;
    this.touch();
  }

  changeRole(newRole: Role): void {
    this.props.role = newRole;
    this.touch();
  }

  changeImagePath(newImagePath: string): void {
    this.props.imagePath = newImagePath;
    this.touch();
  }

  changeBirthDate(newBirthDate: Date): void {
    this.props.birthDate = newBirthDate;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
