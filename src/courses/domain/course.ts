import { DomainException } from 'src/common/exceptions/domain.exception';
import { CourseVisibility } from './enums/course-visibility.enum';
import { CourseProps } from './interfaces/course.props';
import { Section } from './section';
import { Title } from './value-objects/title.vo';
import { Price } from './value-objects/price.vo';
import { SectionOrder } from './value-objects/section-order.vo';

export class Course {
  constructor(
    public readonly id: string,
    private readonly props: CourseProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get imagePath(): string {
    return this.props.imagePath;
  }

  get tagIds(): string[] {
    return this.props.tagIds;
  }

  get description(): string {
    return this.props.description;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get title(): string {
    return this.props.title.value;
  }

  get visibility(): CourseVisibility {
    return this.props.visibility;
  }

  get price(): number | null {
    return this.props.price.value;
  }

  get demoId(): string {
    return this.props.demoId;
  }

  get sections(): Section[] {
    return this.props.sections;
  }

  updateDescription(newDescription: string) {
    if (newDescription === this.props.description) return;
    this.props.description = newDescription;
    this.touch();
  }

  updateImagePath(newImagePath: string) {
    if (newImagePath === this.props.imagePath) return;
    this.props.imagePath = newImagePath;
    this.touch();
  }

  updateVisibility(newVisibility: CourseVisibility) {
    if (newVisibility === this.props.visibility) return;
    this.props.visibility = newVisibility;
    this.touch();
  }

  updateTitle(newTitle: Title) {
    if (this.props.title.equals(newTitle)) return;
    this.props.title = newTitle;
    this.touch();
  }

  updateTags(tagIds: string[]): void {
    this.props.tagIds = tagIds;
    this.touch();
  }

  updatePrice(newPrice: Price) {
    if (this.props.price.equals(newPrice)) return;
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
    newTitle?: Title,
    newOrder?: SectionOrder,
  ): void {
    const section = this.props.sections.find((s) => s.id === sectionId);
    if (!section) throw new DomainException('Section not found in this course');

    let isUpdated = false;

    if (newTitle && newTitle.value !== section.title) {
      const isTitleExists = this.props.sections.some(
        (s) => s.title === newTitle.value && s.id !== sectionId,
      );
      if (isTitleExists) {
        throw new DomainException(
          'Section title must be unique within the course',
        );
      }
      section.updateTitle(newTitle);
      isUpdated = true;
    }

    if (newOrder && newOrder.value !== section.order) {
      const isOrderExists = this.props.sections.some(
        (s) => s.order === newOrder.value && s.id !== sectionId,
      );
      if (isOrderExists) {
        throw new DomainException(
          'Section order must be unique within the course',
        );
      }
      section.updateOrder(newOrder);
      isUpdated = true;
    }

    if (isUpdated) {
      this.touch();
    }
  }

  removeSection(sectionId: string): void {
    const index = this.props.sections.findIndex((s) => s.id === sectionId);
    if (index !== -1) {
      this.props.sections.splice(index, 1);
      this.touch();
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
