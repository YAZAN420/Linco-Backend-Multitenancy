import { DomainException } from 'src/common/exceptions/domain.exception';

export class SectionOrder {
  private constructor(public readonly value: number) {}

  static create(order: number): SectionOrder {
    if (order <= 0) {
      throw new DomainException('errors.SECTION_ORDER_MUST_BE_GREATER_THAN_ZERO');
    }

    if (order > 50) {
      throw new DomainException('errors.SECTION_ORDER_EXCEEDS_MAXIMUM_ALLOWED_VALUE');
    }

    if (!Number.isInteger(order)) {
      throw new DomainException('errors.SECTION_ORDER_MUST_BE_A_WHOLE_NUMBER');
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
