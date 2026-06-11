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
  async create(@Body() dto: CreateSectionDto) {
    const section = await this.sectionCommandService.create(dto);

    return {
      message: 'Section created successfully',
      data: this.sectionResponseMapper.toResponseFromDomain(section),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    const course = await this.sectionCommandService.update(id, dto);

    return {
      message: 'Course updated successfully',
      data: this.sectionResponseMapper.toResponseFromDomain(course),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.sectionCommandService.remove(id);

    return {
      message: 'Course deleted successfully',
      data: null,
    };
  }
}
