import { CourseVisibility } from './enums/course-visibility.enum';
import { CourseProps } from './interfaces/course.props';

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

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
