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

  get creatorId(): string {
    return this.props.creatorId;
  }

  get recipientId(): string {
    return this.props.recipientId;
  }

  get status(): InquiryStatus {
    return this.props.status;
  }

  updateStatus(newStatus: InquiryStatus): void {
    if (this.props.status === newStatus) return;
    this.props.status = newStatus;
    this.touch();
  }

  updateRecipientId(newRecipientId: string): void {
    if (this.props.recipientId === newRecipientId) return;
    this.props.recipientId = newRecipientId;
    this.touch();
  }

  updateCreatorId(newCreatorId: string): void {
    if (this.props.creatorId == newCreatorId) return;
    this.props.creatorId = newCreatorId;
    this.touch();
  }

  updateSubject(newSubject: string): void {
    if (this.props.subject == newSubject) return;
    this.props.subject = newSubject;
    this.touch();
  }

  updateDemoId(newDemoId: string): void {
    if (this.props.demoId == newDemoId) return;
    this.props.demoId = newDemoId;
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
