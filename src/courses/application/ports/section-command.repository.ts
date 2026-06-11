import { Section } from 'src/courses/domain/section';

export abstract class SectionCommandRepository {
  abstract save(section: Section): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(
    courseId: string,
    sectionId: string,
  ): Promise<Section | null>;
}
