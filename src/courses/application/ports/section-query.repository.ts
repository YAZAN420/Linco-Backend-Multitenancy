import { CursorPageDto, PageDto } from 'src/common/dtos/pagination';
import { Course } from 'src/generated/prisma/browser';
import { FindSectionsCursorQuery, FindSectionsQuery } from '../interfaces/find-sections.query';
import { Section } from 'src/generated/prisma/client';

export abstract class SectionQueryRepository {
  abstract findAll(options: FindSectionsQuery): Promise<PageDto<Course>>;
  abstract findAllCursor(
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>>;
  abstract findById(id: string): Promise<Section | null>;
}