import { DomainException } from 'src/common/exceptions/domain.exception';

export class Name {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(name: string): Name {
    const cleanName = name.trim();
    if (cleanName.length === 0) {
      throw new DomainException('errors.NAME_CANNOT_BE_EMPTY');
    }
    if (cleanName.length > 50) {
      throw new DomainException('errors.NAME_CANNOT_EXCEED_50_CHARACTERS');
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
