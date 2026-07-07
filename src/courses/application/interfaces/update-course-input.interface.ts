import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

export interface UpdateCourseInput {
  title?: string;
  price?: number;
  description?: string;
  imagePath?: string;
  visibility?: CourseVisibility;
  tagIds?: string[];
}
