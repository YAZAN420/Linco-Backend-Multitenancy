import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

export interface CreateCourseInput {
  title: string;
  visibility: CourseVisibility;
  demoId: string;
  description: string;
  imagePath: string;
  price?: number | null;
  tagIds?: string[];
}
