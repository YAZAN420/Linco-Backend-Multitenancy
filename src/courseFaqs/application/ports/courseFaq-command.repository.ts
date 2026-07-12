import { CourseFaq } from 'src/courseFaqs/domain/courseFaq';

export abstract class CourseFaqCommandRepository {
  abstract save(courseFaq: CourseFaq): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<CourseFaq | null>;
}
