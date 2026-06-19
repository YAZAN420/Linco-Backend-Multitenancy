import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

import { ExamResponseMapper } from './mappers/exam-response.mapper';
import { ExamsCommandService } from 'src/exams/application/exams-command.service';

@Controller('sections/:sectionId/exams')
export class ExamsCommandController {
  constructor(
    private readonly examCommandService: ExamsCommandService,
    private readonly examResponseMapper: ExamResponseMapper,
  ) {}

  @Post()
  async create(
    @Param("sectionId") sectionId: string,
    @Body() dto: CreateExamDto
  ) {
    const exam = await this.examCommandService.create(sectionId, dto);

    return {
      message: 'Exam created successfully',
      data: this.examResponseMapper.toResponseFromDomain(exam),
    };
  }

  @Patch(':examId')
  async update(
    @Param("sectionId") sectionId: string,
    @Param('examId') examId: string, 
    @Body() dto: UpdateExamDto
  ) {
    const exam = await this.examCommandService.update(sectionId, examId, dto);

    return {
      message: 'Exam updated successfully',
      data: this.examResponseMapper.toResponseFromDomain(exam),
    };
  }

  @Delete(':examId')
  async remove(
    @Param("sectionId") sectionId: string,
    @Param('examId') examId: string
  ) {
    await this.examCommandService.remove(sectionId, examId);

    return {
      message: 'Exam deleted successfully',
      data: null,
    };
  }
}
