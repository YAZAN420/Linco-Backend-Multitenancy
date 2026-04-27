import { InvalidUsernameCharactersException } from '../exceptions/invalid-username-characters.exception';
import { InvalidUsernameLengthException } from '../exceptions/invalid-username-length.exception';

export class Username {
  private readonly value: string;

  constructor(value: string) {
    const trimmed = value.trim();

    if (trimmed.length < 3 || trimmed.length > 20) {
      throw new InvalidUsernameLengthException();
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      throw new InvalidUsernameCharactersException();
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
