import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

export interface UpdateCourseInput {
  title?: string;
  price?: number | null;
  visibility?: CourseVisibility;
}
