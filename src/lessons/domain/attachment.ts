import { AttachmentProps } from './interfaces/attachments.props';
import { FilePath } from './value-objects/file-path.vo';
import { Title } from './value-objects/title.vo';

export class Attachment {
  constructor(
    public readonly id: string,
    private readonly props: AttachmentProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get name(): string {
    return this.props.name.value;
  }

  get path(): string {
    return this.props.path.value;
  }

  get mimeType(): string | null {
    return this.props.mimeType;
  }

  get lessonId(): string {
    return this.props.lessonId;
  }

  updateName(newName: Title) {
    if (this.props.name.equals(newName)) return;
    this.props.name = newName;
    this.touch();
  }

  updatePath(newPath: FilePath) {
    if (this.props.path.equals(newPath)) return;
    this.props.path = newPath;
    this.touch();
  }

  updateMimeType(newMimeType: string | null) {
    if (this.props.mimeType === newMimeType) return;
    this.props.mimeType = newMimeType;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
