import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

export interface UpdateSectionInput {
  title: string | null;
  courseId: string | null;
  order: number | null;
}
