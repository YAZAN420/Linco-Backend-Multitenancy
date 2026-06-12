import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

import { LessonResponseMapper } from './mappers/lesson-response.mapper';
import { LessonsCommandService } from 'src/lessons/application/lessons-command.service';

@Controller('lessons')
export class LessonsCommandController {
  constructor(
    private readonly lessonCommandService: LessonsCommandService,
    private readonly lessonResponseMapper: LessonResponseMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateLessonDto) {
    const lesson = await this.lessonCommandService.create(dto);

    return {
      message: 'Lesson created successfully',
      data: this.lessonResponseMapper.toResponseFromDomain(lesson),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    const lesson = await this.lessonCommandService.update(id, dto);

    return {
      message: 'Lesson updated successfully',
      data: this.lessonResponseMapper.toResponseFromDomain(lesson),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.lessonCommandService.remove(id);

    return {
      message: 'Lesson deleted successfully',
      data: null,
    };
  }
}
