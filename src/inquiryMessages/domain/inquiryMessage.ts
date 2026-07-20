import { InquiryQueryRepository } from 'src/inquiries/application/ports/inquiry-query.repository';
import { InquiryMessageProps } from './interfaces/inquiryMessage.props';

export class InquiryMessage {
  constructor(
    public readonly id: string,
    private readonly props: InquiryMessageProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get inquiryId(): string {
    return this.props.inquiryId;
  }

  get message(): string {
    return this.props.message
  }

  get senderId(): string {
    return this.props.senderId
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateSenderId(newSenderId: string): void {
    if (this.props.senderId == newSenderId) return;
    this.props.senderId = newSenderId;
    this.touch();
  }

  updateInquiryId(newInquiryId: string): void {
    if (this.props.inquiryId == newInquiryId) return;
    this.props.inquiryId = newInquiryId;
    this.touch();
  }

  updateMessage(newMessage: string): void {
    if(this.props.message == newMessage) return;
    this.props.message = newMessage;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
