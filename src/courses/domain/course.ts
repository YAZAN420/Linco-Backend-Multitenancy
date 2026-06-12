import { DomainException } from 'src/common/exceptions/domain.exception';
import { CourseVisibility } from './enums/course-visibility.enum';
import { CourseProps } from './interfaces/course.props';
import { Section } from './section';

export class Course {
  constructor(
    public readonly id: string,
    private readonly props: CourseProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get title(): string {
    return this.props.title;
  }

  get visibility() {
    return this.props.visibility;
  }

  get price() {
    return this.props.price;
  }

  get authorDemoId() {
    return this.props.authorDemoId;
  }

  get sections(): Section[] {
    return this.props.sections;
  }

  updateVisibility(newVisibility: CourseVisibility) {
    if (newVisibility === this.props.visibility) return;
    this.props.visibility = newVisibility;
    this.touch();
  }

  updateTitle(newTitle: string) {
    if (newTitle === this.props.title) return;
    this.props.title = newTitle;
    this.touch();
  }

  updatePrice(newPrice: number | null) {
    if (newPrice === this.props.price) return;
    this.props.price = newPrice;
    this.touch();
  }

  addSection(section: Section): void {
    if (this.props.sections.length >= 50) {
      throw new DomainException('Course cannot have more than 50 sections');
    }

    const isTitleExists = this.props.sections.some(
      (s) => s.title === section.title,
    );
    if (isTitleExists) {
      throw new DomainException(
        'Section title must be unique within the course',
      );
    }

    const isOrderExists = this.props.sections.some(
      (s) => s.order === section.order,
    );
    if (isOrderExists) {
      throw new DomainException(
        'Section order must be unique within the course',
      );
    }

    this.props.sections.push(section);
    this.touch();
  }

  updateSection(
    sectionId: string,
    title: string | null,
    order: number | null,
  ): void {
    const section = this.props.sections.find((s) => s.id === sectionId);
    if (!section) throw new DomainException('Section not found in this course');

    if (title && title !== section.title) {
      const isTitleExists = this.props.sections.some(
        (s) => s.title === title && s.id !== sectionId,
      );
      if (isTitleExists)
        throw new DomainException(
          'Section title must be unique within the course',
        );
      section.updateTitle(title);
    }

    if (order !== undefined && order !== section.order) {
      const isOrderExists = this.props.sections.some(
        (s) => s.order === order && s.id !== sectionId,
      );
      if (isOrderExists)
        throw new DomainException(
          'Section order must be unique within the course',
        );
      section.updateOrder(order ?? section.order);
    }

    this.touch();
  }

  removeSection(sectionId: string): void {
    const initialLength = this.props.sections.length;
    this.props.sections = this.props.sections.filter((s) => s.id !== sectionId);

    if (this.props.sections.length !== initialLength) {
      this.touch();
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
