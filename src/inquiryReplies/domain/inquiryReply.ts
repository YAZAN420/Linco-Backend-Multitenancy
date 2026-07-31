import { InquirySenderType } from './enums/InquirySenderType';
import { InquiryReplyProps } from './interfaces/inquiryReply.props';

export class InquiryReply {
  constructor(
    public readonly id: string,
    private readonly props: InquiryReplyProps,
  ) {}

  get message(): string {
    return this.props.message;
  }

  get senderType(): InquirySenderType {
    return this.props.senderType;
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get inquiryId(): string {
    return this.props.inquiryId;
  }

  updateMessage(newMessage: string): void {
    if (this.props.message == newMessage) return;
    this.props.message = newMessage;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
