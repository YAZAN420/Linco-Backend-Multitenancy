import { Controller, Get, Param, Query } from '@nestjs/common';
import { SectionResponseMapper } from './mappers/section-response.mapper';
import { FindSectionsCursorDto } from './dto/filters/find-sections-cursor.dto';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';

@Controller('courses/:courseId/sections')
export class SectionsQueryController {
  constructor(
    private readonly sectionQueryService: SectionsQueryService,
    private readonly sectionResponseMapper: SectionResponseMapper,
  ) {}

  @Get('cursor')
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

  @Get(':sectionId')
  async findOne(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
  ) {
    const section = await this.sectionQueryService.findById(
      courseId,
      sectionId,
    );

    return {
      message: 'Section retrieved successfully',
      data: this.sectionResponseMapper.toResponseFromPrisma(section),
    };
  }
}
