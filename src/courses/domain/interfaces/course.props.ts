import { CourseVisibility } from '../enums/course-visibility.enum';

export interface CourseProps {
  title: string;
  visibility: CourseVisibility;
  authorDemoId: string | null;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
}
