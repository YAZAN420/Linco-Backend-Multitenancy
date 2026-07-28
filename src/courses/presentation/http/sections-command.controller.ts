import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SectionsCommandService } from 'src/courses/application/sections-command.service';
import { SectionResponseMapper } from './mappers/section-response.mapper';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Section')
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
      message: 'messages.SECTION_CREATED_SUCCESSFULLY',
      data: this.sectionResponseMapper.toResponseFromDomain(section),
    };
  }

  @Patch(':sectionId')
  async update(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
  ) {
    const section = await this.sectionCommandService.update(
      courseId,
      sectionId,
      dto,
    );

    return {
      message: 'messages.SECTION_UPDATED_SUCCESSFULLY',
      data: this.sectionResponseMapper.toResponseFromDomain(section),
    };
  }

  @Delete(':sectionId')
  async remove(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
  ) {
    await this.sectionCommandService.remove(courseId, sectionId);

    return {
      message: 'messages.SECTION_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
