import { InquiryStatus } from './enums/inqurity-status.enum';
import { InquiryProps } from './interfaces/inquiry.props';

export class Inquiry {
  constructor(
    public readonly id: string,
    private readonly props: InquiryProps,
  ) {}

  get subject(): string {
    return this.props.subject;
  }

  get demoId(): string {
    return this.props.demoId;
  }

  get message(): string {
    return this.props.message;
  }

  get creatorId(): string {
    return this.props.creatorId;
  }

  get status(): InquiryStatus {
    return this.props.status;
  }

  updateStatus(newStatus: InquiryStatus): void {
    if (this.props.status === newStatus) return;
    this.props.status = newStatus;
    this.touch();
  }

  updateSubject(newSubject: string): void {
    if (this.props.subject == newSubject) return;
    this.props.subject = newSubject;
    this.touch();
  }

  updateMessage(newMessage: string): void {
    if (this.props.message == newMessage) return;
    this.props.message = newMessage;
    this.touch();
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
