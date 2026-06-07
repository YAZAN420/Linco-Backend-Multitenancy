import { Course } from 'src/courses/domain/course';

export abstract class CourseCommandRepository {
  abstract save(course: Course): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Course | null>;
}
