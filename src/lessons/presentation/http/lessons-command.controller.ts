import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

import { LessonResponseMapper } from './mappers/lesson-response.mapper';
import { LessonsCommandService } from 'src/lessons/application/lessons-command.service';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';
import { GenerateUploadUrlDto } from 'src/common/dtos/generate-upload-url.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Lesson')
@Controller('sections/:sectionId/lessons')
export class LessonsCommandController {
  constructor(
    private readonly lessonCommandService: LessonsCommandService,
    private readonly sectionQueryService: SectionsQueryService,
    private readonly lessonResponseMapper: LessonResponseMapper,
  ) {}

  @Post('upload-url')
  async getUploadUrl(@Body() dto: GenerateUploadUrlDto) {
    return await this.lessonCommandService.generateLessonVideoUploadUrl(
      dto.fileName,
    );
  }

  @Post()
  async create(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateLessonDto,
  ) {
    const section = await this.sectionQueryService.exists(sectionId);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    const lesson = await this.lessonCommandService.create(sectionId, dto);

    return {
      message: 'Lesson created successfully',
      data: this.lessonResponseMapper.toResponseFromDomain(lesson),
    };
  }

  @Patch(':lessonId')
  async update(
    @Param('sectionId') sectionId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateLessonDto,
  ) {
    const section = await this.sectionQueryService.exists(sectionId);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    const lesson = await this.lessonCommandService.update(
      sectionId,
      lessonId,
      dto,
    );

    return {
      message: 'Lesson updated successfully',
      data: this.lessonResponseMapper.toResponseFromDomain(lesson),
    };
  }

  @Delete(':lessonId')
  async remove(
    @Param('sectionId') sectionId: string,
    @Param('lessonId') lessonId: string,
  ) {
    const section = await this.sectionQueryService.exists(sectionId);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    await this.lessonCommandService.remove(sectionId, lessonId);

    return {
      message: 'Lesson deleted successfully',
      data: null,
    };
  }
}
