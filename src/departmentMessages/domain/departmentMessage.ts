import { DepartmentMessageProps } from './interfaces/departmentMessage.props';
import { MessageType } from './enums/message-type.enum';
import { DomainException } from 'src/common/exceptions/domain.exception';

export class DepartmentMessage {
  constructor(
    public readonly id: string,
    private readonly props: DepartmentMessageProps,
  ) {}

  get departmentId(): string {
    return this.props.departmentId;
  }

  get senderId(): string {
    return this.props.senderId;
  }

  get type(): MessageType {
    return this.props.type;
  }

  get content(): string | undefined {
    return this.props.content;
  }

  get blobName(): string | undefined {
    return this.props.blobName;
  }

  get fileName(): string | undefined {
    return this.props.fileName;
  }

  get mimeType(): string | undefined {
    return this.props.mimeType;
  }

  get fileSize(): number | undefined {
    return this.props.fileSize;
  }

  get replyToId(): string | undefined {
    return this.props.replyToId;
  }

  get isEdited(): boolean {
    return this.props.isEdited;
  }

  get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public editContent(newContent: string): void {
    if (this.props.isDeleted) {
      throw new DomainException('Cant edit a deleted message');
    }
    this.props.content = newContent;
    this.props.isEdited = true;
    this.props.updatedAt = new Date();
  }

  public softDelete(): void {
    this.props.isDeleted = true;
    this.props.content = undefined;
    this.props.blobName = undefined;
    this.props.fileName = undefined;
    this.props.mimeType = undefined;
    this.props.fileSize = undefined;
    this.props.updatedAt = new Date();
  }
}
