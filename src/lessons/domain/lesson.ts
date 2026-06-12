import { LessonProps } from './interfaces/lesson.props';

export class Lesson {
  constructor(
    public readonly id: string,
    private readonly props: LessonProps,
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

  get videoUrl(): string {
    return this.props.videoUrl;
  }

  get subTitleUrl(): string | null {
    return this.props.subTitleUrl;
  }

  get sectionId(): string {
    return this.props.sectionId;
  }

  get courseId(): string {
    return this.props.courseId;
  }
}
