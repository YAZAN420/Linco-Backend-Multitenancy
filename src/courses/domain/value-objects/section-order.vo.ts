import { DomainException } from 'src/common/exceptions/domain.exception';

export class SectionOrder {
  private constructor(public readonly value: number) {}

  static create(order: number): SectionOrder {
    if (order <= 0) {
      throw new DomainException('Section order must be greater than zero');
    }

    if (order > 50) {
      throw new DomainException('Section order exceeds maximum allowed value');
    }

    if (!Number.isInteger(order)) {
      throw new DomainException('Section order must be a whole number');
    }

    return new SectionOrder(order);
  }

  static fromPersistence(sectionOrder: number): SectionOrder {
    return new SectionOrder(sectionOrder);
  }

  equals(other: SectionOrder): boolean {
    return this.value === other.value;
  }
}
