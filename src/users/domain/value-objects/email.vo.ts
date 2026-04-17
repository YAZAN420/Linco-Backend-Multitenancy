export class Email {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim().toLowerCase();

    if (!this.isValid(trimmed)) {
      throw new Error('Invalid email format');
    }

    this.value = trimmed;
  }

  private isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.getValue();
  }
}
