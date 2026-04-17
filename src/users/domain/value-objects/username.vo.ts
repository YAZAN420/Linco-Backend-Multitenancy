export class Username {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length < 3 || trimmed.length > 20) {
      throw new Error('Username must be between 3 and 20 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      throw new Error('Username contains invalid characters');
    }

    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Username): boolean {
    return this.value === other.getValue();
  }
}
