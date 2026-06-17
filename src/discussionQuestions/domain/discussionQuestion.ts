import { DiscussionQuestionProps } from './interfaces/discussionQuestion.props';

export class DiscussionQuestion {
  constructor(
    public readonly id: string,
    private readonly props: DiscussionQuestionProps,
  ) {}

  get content(): string {
    return this.props.content;
  }

  get lessonId(): string {
    return this.props.lessonId;
  }

  get demoMemberId(): string {
    return this.props.demoMemberId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateContent(newContent: string): void {
    if (this.props.content === newContent) return;
    this.props.content = newContent;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
