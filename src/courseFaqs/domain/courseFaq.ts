import { CourseFaqProps } from './interfaces/courseFaq.props';

export class CourseFaq {
  constructor(
    public readonly id: string,
    private readonly props: CourseFaqProps,
  ) {}

  get question(): string {
    return this.props.question;
  }

  get answer(): string {
    return this.props.answer;
  }

  get courseId(): string {
    return this.props.courseId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
