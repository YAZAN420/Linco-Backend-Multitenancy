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

  updateFirstName(newFirstName: string): void {
    if (newFirstName === this.props.firstName) return;
    this.props.firstName = newFirstName;
    this.touch();
  }

  updateLastName(newLastName: string): void {
    if (newLastName === this.props.lastName) return;
    this.props.lastName = newLastName;
    this.touch();
  }

  updateRole(newRole: Role): void {
    if (newRole === this.props.role) return;
    this.props.role = newRole;
    this.touch();
  }

  updateImagePath(newImagePath: string): void {
    if (newImagePath === this.props.imagePath) return;
    this.props.imagePath = newImagePath;
    this.touch();
  }

  updateBirthDate(newBirthDate: Date): void {
    if (newBirthDate.getTime() === this.props.birthDate.getTime()) return;
    this.props.birthDate = newBirthDate;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
