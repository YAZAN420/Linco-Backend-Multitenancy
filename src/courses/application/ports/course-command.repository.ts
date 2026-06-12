import { Course } from 'src/courses/domain/course';
import { Section } from 'src/courses/domain/section';

export abstract class CourseCommandRepository {
  abstract save(course: Course): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Course | null>;
  abstract findSectionById(sectionId: string): Promise<Section | null>;
}
