import { DomainException } from 'src/common/exceptions/domain.exception';

export class Price {
  private constructor(public readonly value: number) {}

  static create(price: number): Price {
    if (price < 0) {
      throw new DomainException('errors.COURSE_PRICE_CANNOT_BE_NEGATIVE');
    }

    if (price > 10000) {
      throw new DomainException('errors.COURSE_PRICE_EXCEEDS_MAXIMUM_ALLOWED_VALUE');
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
