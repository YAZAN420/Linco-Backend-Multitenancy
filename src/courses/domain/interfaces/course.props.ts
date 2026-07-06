import { CourseVisibility } from '../enums/course-visibility.enum';
import { Section } from '../section';
import { Price } from '../value-objects/price.vo';
import { Title } from '../value-objects/title.vo';

export interface CourseProps {
  title: Title;
  visibility: CourseVisibility;
  imagePath: string;
  description: string;
  demoId: string;
  price: Price;
  sections: Section[];
  tagIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
