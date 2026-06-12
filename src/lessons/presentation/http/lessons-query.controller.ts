import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindLessonsCursorDto } from './dto/filters/find-lessons-cursor.dto';

import { LessonsQueryService } from 'src/lessons/application/lessons-query.service';

import { LessonResponseMapper } from './mappers/lesson-response.mapper';

@Controller('lessons')
export class LessonsQueryController {
  constructor(
    private readonly lessonQueryService: LessonsQueryService,
    private readonly lessonResponseMapper: LessonResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(@Query() options: FindLessonsCursorDto) {
    const lessons = await this.lessonQueryService.findAllCursor(options);

    return {
      message: 'Lessons fetched successfully (Cursor)',
      data: this.lessonResponseMapper.toResponseManyFromPrisma(lessons.data),
      meta: lessons.meta,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const lesson = await this.lessonQueryService.findById(id);

    return {
      message: 'Lesson retrieved successfully',
      data: this.lessonResponseMapper.toResponseFromPrisma(lesson),
    };
  }
}
