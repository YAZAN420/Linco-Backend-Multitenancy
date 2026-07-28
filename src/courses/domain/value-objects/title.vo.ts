import { DomainException } from 'src/common/exceptions/domain.exception';

export class Title {
  private constructor(public readonly value: string) {}

  static create(title: string): Title {
    if (!title || title.trim().length === 0) {
      throw new DomainException('errors.TITLE_CANNOT_BE_EMPTY');
    }

    if (title.length > 100) {
      throw new DomainException('errors.TITLE_CANNOT_EXCEED_100_CHARACTERS');
    }

    return new Title(title.trim());
  }

  static fromPersistence(title: string): Title {
    return new Title(title);
  }

  equals(other: Title): boolean {
    return this.value === other.value;
  }
}
