import { Controller, Get, Param, Query } from '@nestjs/common';
import { SectionResponseMapper } from './mappers/section-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Section')
@Controller('courses/:courseId/sections')
export class SectionsQueryController {
  constructor(
    private readonly sectionQueryService: SectionsQueryService,
    private readonly sectionResponseMapper: SectionResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('courseId') courseId: string,
    @Query() options: CursorPageOptionsDto,
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
