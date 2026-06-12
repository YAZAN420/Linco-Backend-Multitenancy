import { Lesson } from 'src/lessons/domain/lesson';

export abstract class LessonCommandRepository {
  abstract save(lesson: Lesson): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<Lesson | null>;
}
