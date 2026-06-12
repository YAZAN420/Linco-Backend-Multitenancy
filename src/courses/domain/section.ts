import { SectionProps } from './interfaces/section.props';

export class Section {
  constructor(
    public readonly id: string,
    private readonly props: SectionProps,
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

  get order(): number {
    return this.props.order;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  updateTitle(title: string): void {
    this.props.title = title;
    this.touch();
  }

  updateOrder(order: number): void {
    this.props.order = order;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
