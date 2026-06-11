import { Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';

import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { FindSectionsCursorQuery, FindSectionsQuery } from './interfaces/find-sections.query';
import { Section } from '../domain/section';
import { SectionQueryRepository } from './ports/section-query.repository';

@Injectable()
export class SectionsQueryService {
  constructor(private readonly sectionQueryRepository: SectionQueryRepository) {}

  async findAll(pageOptionsDto: FindSectionsQuery): Promise<PageDto<Section>> {
    return this.sectionQueryRepository.findAll(pageOptionsDto);
  }

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
