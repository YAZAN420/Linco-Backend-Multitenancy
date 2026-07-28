import { DomainException } from 'src/common/exceptions/domain.exception';

export class LessonOrder {
  private constructor(public readonly value: number) {}

  static create(order: number): LessonOrder {
    if (order <= 0) {
      throw new DomainException('errors.LESSON_ORDER_MUST_BE_GREATER_THAN_ZERO');
    }

    if (order > 100) {
      throw new DomainException('errors.LESSON_ORDER_EXCEEDS_MAXIMUM_ALLOWED_VALUE');
    }

    if (!Number.isInteger(order)) {
      throw new DomainException('errors.LESSON_ORDER_MUST_BE_A_WHOLE_NUMBER');
    }

    return new LessonOrder(order);
  }

  static fromPersistence(sectionOrder: number): LessonOrder {
    return new LessonOrder(sectionOrder);
  }

  equals(other: LessonOrder): boolean {
    return this.value === other.value;
  }
}
