import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

export interface CreateCourseInput {
  title: string;
  visibility: CourseVisibility;
  demoId: string;
  price?: number | null;
}
