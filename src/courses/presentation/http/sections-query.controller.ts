import { Controller, Get, Param, Query } from '@nestjs/common';
import { SectionResponseMapper } from './mappers/section-response.mapper';
import { FindSectionsCursorDto } from './dto/filters/find-sections-cursor.dto';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';

@Controller('')
export class SectionsQueryController {
  constructor(
    private readonly sectionQueryService: SectionsQueryService,
    private readonly sectionResponseMapper: SectionResponseMapper,
  ) {}

  @Get('courses/:courseId/sections/cursor')
  async findWithCursor(
    @Param('courseId') courseId: string,
    @Query() options: FindSectionsCursorDto,
  ) {
    const sections = await this.sectionQueryService.findAllCursor(
      courseId,
      options,
    );

    return {
      message: 'Sections fetched successfully',
      data: this.sectionResponseMapper.toResponseManyFromPrisma(sections.data),
      meta: sections.meta,
    };
  }

  @Get('sections/:sectionId')
  async findOne(@Param('sectionId') sectionId: string) {
    const section = await this.sectionQueryService.findById(sectionId);

    return {
      message: 'Section retrieved successfully',
      data: this.sectionResponseMapper.toResponseFromPrisma(section),
    };
  }
}
