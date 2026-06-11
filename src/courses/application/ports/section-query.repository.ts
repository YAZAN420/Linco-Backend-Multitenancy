import { CursorPageDto } from 'src/common/dtos/pagination';
import { FindSectionsCursorQuery } from '../interfaces/find-sections.query';
import { Section } from 'src/generated/prisma/client';

export abstract class SectionQueryRepository {
  abstract findAllCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>>;
  abstract findById(
    courseId: string,
    sectionId: string,
  ): Promise<Section | null>;
}
