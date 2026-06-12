import { CourseVisibility } from '../enums/course-visibility.enum';
import { Section } from '../section';

export interface CourseProps {
  title: string;
  visibility: CourseVisibility;
  authorDemoId: string | null;
  price: number | null;
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}
