import { DomainException } from 'src/common/exceptions/domain.exception';
import { Attachment } from './attachment';
import { LessonProps } from './interfaces/lesson.props';
import { Title } from './value-objects/title.vo';
import { FilePath } from '../../common/value-objects/file-path.vo';
import { Url } from '../../common/value-objects/url.vo';
import { LessonOrder } from './value-objects/lesson-order.vo';

export class Lesson {
  constructor(
    public readonly id: string,
    private readonly props: LessonProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get description(): string {
    return this.props.description;
  }

  get duration(): number {
    return this.props.duration;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get title(): string {
    return this.props.title.value;
  }

  get order(): number {
    return this.props.order.value;
  }

  get videoUrl(): string {
    return this.props.videoUrl.value;
  }

  get subTitleUrl(): string | null {
    return this.props.subTitleUrl?.value ?? null;
  }

  get sectionId(): string {
    return this.props.sectionId;
  }

  get attachments(): Attachment[] {
    return [...this.props.attachments];
  }

  updateDuration(newDuration: number) {
    if (this.props.duration === newDuration) return;
    this.props.duration = newDuration;
    this.touch();
  }

  updateDescription(newDescription: string) {
    if (this.props.description === newDescription) return;
    this.props.description = newDescription;
    this.touch();
  }

  updateTitle(newTitle: Title) {
    if (this.props.title.equals(newTitle)) return;
    this.props.title = newTitle;
    this.touch();
  }

  updateOrder(newOrder: LessonOrder) {
    if (this.props.order.equals(newOrder)) return;
    this.props.order = newOrder;
    this.touch();
  }

  updateVideoUrl(newVideoUrl: Url) {
    if (this.props.videoUrl.equals(newVideoUrl)) return;
    this.props.videoUrl = newVideoUrl;
    this.touch();
  }

  updateSubTitleUrl(newSubTitleUrl: Url | null) {
    if (this.props.subTitleUrl === null && newSubTitleUrl === null) return;
    if (
      this.props.subTitleUrl &&
      newSubTitleUrl &&
      this.props.subTitleUrl.equals(newSubTitleUrl)
    )
      return;
    this.props.subTitleUrl = newSubTitleUrl;
    this.touch();
  }

  addAttachment(attachment: Attachment) {
    if (this.props.attachments.length >= 10) {
      throw new DomainException('errors.LESSON_CANNOT_HAVE_MORE_THAN_10_ATTACHMENTS');
    }
    const exist = this.props.attachments.some((a) => a.id === attachment.id);
    if (exist) {
      throw new DomainException('errors.ATTACHMENT_ALREADY_EXISTS_IN_THIS_LESSON');
    }
    this.props.attachments.push(attachment);
    this.touch();
  }

  updateAttachment(
    attachmentId: string,
    name: Title | null,
    path: FilePath | null,
    mimeType: string | null,
  ) {
    const attachment = this.props.attachments.find(
      (a) => a.id === attachmentId,
    );
    if (!attachment) {
      throw new DomainException('errors.ATTACHMENT_NOT_FOUND_IN_THIS_LESSON');
    }

    if (name) attachment.updateName(name);
    if (path) attachment.updatePath(path);
    if (mimeType) attachment.updateMimeType(mimeType);

    this.touch();
  }

  removeAttachment(attachmentId: string) {
    const initialLength = this.props.attachments.length;
    this.props.attachments = this.props.attachments.filter(
      (a) => a.id !== attachmentId,
    );
    if (this.props.attachments.length === initialLength) {
      throw new DomainException('errors.ATTACHMENT_NOT_FOUND_IN_THIS_LESSON');
    }
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
