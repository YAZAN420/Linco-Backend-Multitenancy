import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';

import { LessonsQueryService } from 'src/lessons/application/lessons-query.service';

import { LessonResponseMapper } from './mappers/lesson-response.mapper';
import { SectionsQueryService } from 'src/courses/application/sections-query.service';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination/cursor/cursor-page-options.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Lesson')
@Controller('sections/:sectionId/lessons')
export class LessonsQueryController {
  constructor(
    private readonly lessonQueryService: LessonsQueryService,
    private readonly sectionsQueryService: SectionsQueryService,
    private readonly lessonResponseMapper: LessonResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('sectionId') sectionId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const section = await this.sectionsQueryService.exists(sectionId);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    const lessons = await this.lessonQueryService.findAllCursor(
      sectionId,
      options,
    );

    return {
      message: 'Lessons fetched successfully',
      data: this.lessonResponseMapper.toResponseManyFromPrisma(lessons.data),
      meta: lessons.meta,
    };
  }

  @Get(':lessonId')
  async findOne(
    @Param('sectionId') sectionId: string,
    @Param('lessonId') lessonId: string,
  ) {
    const section = await this.sectionsQueryService.exists(sectionId);
    if (!section) {
      throw new NotFoundException('Section not found');
    }

    const lesson = await this.lessonQueryService.findById(sectionId, lessonId);

    return {
      message: 'Lesson retrieved successfully',
      data: this.lessonResponseMapper.toResponseFromPrisma(lesson),
    };
  }
}
