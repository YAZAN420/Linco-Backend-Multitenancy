import { DomainException } from 'src/common/exceptions/domain.exception';

export class LessonOrder {
  private constructor(public readonly value: number) {}

  static create(order: number): LessonOrder {
    if (order <= 0) {
      throw new DomainException('Lesson order must be greater than zero');
    }

    if (order > 100) {
      throw new DomainException('Lesson order exceeds maximum allowed value');
    }

    if (!Number.isInteger(order)) {
      throw new DomainException('Lesson order must be a whole number');
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
