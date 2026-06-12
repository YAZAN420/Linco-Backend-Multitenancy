import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionsCommandService } from 'src/courses/application/sections-command.service';
import { SectionResponseMapper } from './mappers/section-response.mapper';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller()
export class SectionsCommandController {
  constructor(
    private readonly sectionCommandService: SectionsCommandService,
    private readonly sectionResponseMapper: SectionResponseMapper,
  ) {}

  @Post('courses/:courseId/sections')
  async create(
    @Param('courseId') courseId: string,
    @Body() dto: CreateSectionDto,
  ) {
    const section = await this.sectionCommandService.create(courseId, dto);

    return {
      message: 'Section created successfully',
      data: this.sectionResponseMapper.toResponseFromDomain(section),
    };
  }

  @Patch('sections/:sectionId')
  async update(
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
  ) {
    const section = await this.sectionCommandService.update(sectionId, dto);

    return {
      message: 'Section updated successfully',
      data: this.sectionResponseMapper.toResponseFromDomain(section),
    };
  }

  @Delete('sections/:sectionId')
  async remove(@Param('sectionId') sectionId: string) {
    await this.sectionCommandService.remove(sectionId);

    return {
      message: 'Section deleted successfully',
      data: null,
    };
  }
}
