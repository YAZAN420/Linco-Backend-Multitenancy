import { DomainException } from 'src/common/exceptions/domain.exception';

export class PositiveInteger {
  private constructor(public readonly value: number) {}

  static create(positiveInteger: number, msg: string): PositiveInteger {
    if (positiveInteger <= 0) {
      throw new DomainException(`${msg} must be greater than zero`);
    }

    if (positiveInteger > 1000) {
      throw new DomainException(`${msg} exceeds maximum allowed value`);
    }

    if (!Number.isInteger(positiveInteger)) {
      throw new DomainException(`${msg} must be a whole number`);
    }

    return new PositiveInteger(positiveInteger);
  }

  static fromPersistence(positiveInteger: number): PositiveInteger {
    return new PositiveInteger(positiveInteger);
  }

  equals(other: PositiveInteger): boolean {
    return this.value === other.value;
  }
}
