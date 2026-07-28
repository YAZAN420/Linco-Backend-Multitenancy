import { DomainException } from 'src/common/exceptions/domain.exception';

export class Url {
  private constructor(public readonly value: string) {}

  static create(url: string): Url {
    if (!url || url.trim().length === 0) {
      throw new DomainException('errors.URL_CANNOT_BE_EMPTY');
    }

    try {
      new URL(url);
    } catch {
      throw new DomainException('errors.INVALID_URL_FORMAT');
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
