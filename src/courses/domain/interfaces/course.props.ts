import { CourseVisibility } from '../enums/course-visibility.enum';
import { Section } from '../section';
import { Price } from '../value-objects/price.vo';
import { Title } from '../value-objects/title.vo';

export interface CourseProps {
  title: Title;
  visibility: CourseVisibility;
  demoId: string;
  price: Price;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}
