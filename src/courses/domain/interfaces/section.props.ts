import { SectionOrder } from '../value-objects/section-order.vo';
import { Title } from '../value-objects/title.vo';

export interface SectionProps {
  title: Title;
  order: SectionOrder;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
}
