import { Injectable, NotFoundException } from '@nestjs/common';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindSectionsCursorQuery } from './interfaces/find-sections.query';
import { SectionQueryRepository } from './ports/section-query.repository';
import { Section } from 'src/generated/prisma/client';

@Injectable()
export class SectionsQueryService {
  constructor(
    private readonly sectionQueryRepository: SectionQueryRepository,
  ) {}

  async findAllCursor(
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    return this.sectionQueryRepository.findAllCursor(options);
  }

  async findById(id: string): Promise<Section> {
    const section = await this.sectionQueryRepository.findById(id);
    if (!section) throw new NotFoundException('Section not found');
    return section;
  }
}
