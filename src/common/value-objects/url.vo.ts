import { DomainException } from 'src/common/exceptions/domain.exception';

export class Url {
  private constructor(public readonly value: string) {}

  static create(url: string): Url {
    if (!url || url.trim().length === 0) {
      throw new DomainException('URL cannot be empty');
    }

    try {
      new URL(url);
    } catch {
      throw new DomainException('Invalid URL format');
    }

    return new Url(url.trim());
  }

  static fromPersistence(url: string): Url {
    return new Url(url);
  }

  equals(other: Url): boolean {
    return this.value === other.value;
  }
}
