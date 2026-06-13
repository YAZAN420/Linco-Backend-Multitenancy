import { SectionProps } from './interfaces/section.props';
import { SectionOrder } from './value-objects/section-order.vo';
import { Title } from './value-objects/title.vo';

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
    return this.props.title.value;
  }

  get order(): number {
    return this.props.order.value;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  updateTitle(newTitle: Title): void {
    if (this.props.title.equals(newTitle)) return;
    this.props.title = newTitle;
    this.touch();
  }

  updateOrder(newOrder: SectionOrder): void {
    if (this.props.order.equals(newOrder)) return;
    this.props.order = newOrder;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
