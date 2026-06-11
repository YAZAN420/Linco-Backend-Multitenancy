import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionsCommandService } from 'src/courses/application/sections-command.service';
import { SectionResponseMapper } from './mappers/section-response.mapper';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('courses/:courseId/sections')
export class SectionsCommandController {
  constructor(
    private readonly sectionCommandService: SectionsCommandService,
    private readonly sectionResponseMapper: SectionResponseMapper,
  ) {}

  @Post()
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

  @Patch(':sectionId')
  async update(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
  ) {
    const course = await this.sectionCommandService.update(
      courseId,
      sectionId,
      dto,
    );

    return {
      message: 'Section updated successfully',
      data: this.sectionResponseMapper.toResponseFromDomain(course),
    };
  }

  @Delete(':sectionId')
  async remove(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
  ) {
    await this.sectionCommandService.remove(courseId, sectionId);

    return {
      message: 'Section deleted successfully',
      data: null,
    };
  }
}
