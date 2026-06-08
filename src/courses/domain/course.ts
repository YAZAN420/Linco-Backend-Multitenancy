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

  publish() {
    this.props.visibility = CourseVisibility.PUBLIC;
    this.props.updatedAt = new Date();
  }

  updateTitle(title: string) {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  updatePrice(price: number | null) {
    this.props.price = price;
    this.props.updatedAt = new Date();
  }
}
