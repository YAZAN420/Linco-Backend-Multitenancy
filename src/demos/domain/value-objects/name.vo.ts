import { DomainValidationException } from '../exceptions/validation.exception';

export class Name {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(name: string): Name {
    const cleanName = name.trim();
    if (cleanName.length === 0) {
      throw new DomainValidationException('Name cannot be empty');
    }
    if (cleanName.length > 50) {
      throw new DomainValidationException('Name cannot exceed 50 characters');
    }
    return new Name(cleanName);
  }

  static fromPersistence(name: string): Name {
    return new Name(name);
  }

  equals(other: Name): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }
}
