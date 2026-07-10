import { DiscussionAnswerProps } from './interfaces/discussionAnswer.props';

export class DiscussionAnswer {
  constructor(
    public readonly id: string,
    private readonly props: DiscussionAnswerProps,
  ) {}

  get content(): string {
    return this.props.content;
  }
  get discussionId(): string {
    return this.props.discussionId;
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
