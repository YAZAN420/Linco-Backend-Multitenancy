import { InvalidEmailFormatException } from '../exceptions/invalid-email-format.exception';

export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): Email {
    const trimmed = value.trim().toLowerCase();

    if (!this.isValid(trimmed)) {
      throw new InvalidEmailFormatException();
    }

    return Email.create(trimmed);
  }

  static fromPersistence(value: string): Email {
    return Email.create(value);
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}
