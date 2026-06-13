import { Attachment } from '../attachment';
import { LessonOrder } from '../value-objects/lesson-order.vo';
import { Title } from '../value-objects/title.vo';
import { Url } from '../value-objects/url.vo';

export interface LessonProps {
  title: Title;
  videoUrl: Url;
  order: LessonOrder;
  sectionId: string;
  courseId: string;
  subTitleUrl: Url | null;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}
