import { Attachment } from '../attachment';
import { LessonOrder } from '../value-objects/lesson-order.vo';
import { Title } from '../value-objects/title.vo';
import { Url } from '../../../common/value-objects/url.vo';

export interface LessonProps {
  title: Title;
  description: string;
  videoUrl: Url;
  order: LessonOrder;
  duration: number;
  sectionId: string;
  subTitleUrl: Url | null;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}
