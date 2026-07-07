import { DomainException } from 'src/common/exceptions/domain.exception';

export class Price {
  private constructor(public readonly value: number) {}

  static create(price: number): Price {
    if (price < 0) {
      throw new DomainException('Course price cannot be negative');
    }

    if (price > 10000) {
      throw new DomainException('Course price exceeds maximum allowed value');
    }

    return new Price(price);
  }

  static fromPersistence(price: number): Price {
    return new Price(price);
  }

  equals(other: Price): boolean {
    return this.value === other.value;
  }
}
