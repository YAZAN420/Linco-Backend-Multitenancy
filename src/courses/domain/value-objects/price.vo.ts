import { DomainException } from 'src/common/exceptions/domain.exception';

export class Price {
  private constructor(public readonly value: number | null) {}

  static create(price: number | null): Price {
    if (price !== null && price < 0) {
      throw new DomainException('Course price cannot be negative');
    }

    if (price !== null && price > 10000) {
      throw new DomainException('Course price exceeds maximum allowed value');
    }

    return new Price(price);
  }

  static fromPersistence(price: number | null): Price {
    return new Price(price);
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }
}
