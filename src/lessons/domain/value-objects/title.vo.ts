import { DomainException } from 'src/common/exceptions/domain.exception';

export class Title {
  private constructor(public readonly value: string) {}

  static create(title: string): Title {
    if (!title || title.trim().length === 0) {
      throw new DomainException('Lesson title cannot be empty');
    }

    if (title.length > 100) {
      throw new DomainException('Lesson title cannot exceed 100 characters');
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
