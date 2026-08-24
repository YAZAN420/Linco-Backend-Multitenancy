import { CursorPageDto } from 'src/common/dtos/pagination';
import { Section } from 'src/generated/prisma/client';
import { FindSectionsCursorQuery } from '../interfaces/find-sections.query';
import { SectionWithExamAndQuestionCount } from 'src/core/database/prisma/types';

export abstract class SectionQueryRepository {
  abstract findAllCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>>;
  abstract findById(sectionId: string): Promise<Section | null>;
  abstract findSectionWithExamAndQuestionCount(
    sectionId: string,
  ): Promise<SectionWithExamAndQuestionCount | null>;
}
