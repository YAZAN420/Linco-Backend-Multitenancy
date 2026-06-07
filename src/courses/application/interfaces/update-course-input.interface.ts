import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

export interface UpdateCourseInput {
  title: string | null;
  price: number | null;
  visibility: CourseVisibility | null;
}
