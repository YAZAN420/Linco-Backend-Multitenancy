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

  get title(): String {
    return this.props.title;
  }

  get order(): number {
    return this.props.order;
  }

  get courseId(): number {
    return this.props.courseId;
  }
}
