import { Controller, Get, Param, Query } from '@nestjs/common';
import { SectionResponseMapper } from './mappers/section-response.mapper';
import { FindSectionsCursorDto } from './dto/filters/find-sections-cursor.dto';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';

@Controller('sections')
export class SectionsQueryController {
  constructor(
    private readonly sectionQueryService: SectionsQueryService,
    private readonly sectionResponseMapper: SectionResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(@Query() options: FindSectionsCursorDto) {
    const sections = await this.sectionQueryService.findAllCursor(options);

    return {
      message: 'Sections fetched successfully (Cursor)',
      data: this.sectionResponseMapper.toResponseManyFromPrisma(sections.data),
      meta: sections.meta,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const section = await this.sectionQueryService.findById(id);

    return {
      message: 'Section retrieved successfully',
      data: this.sectionResponseMapper.toResponseFromPrisma(section),
    };
  }
}
