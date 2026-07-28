import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

import { ExamResponseMapper } from './mappers/exam-response.mapper';
import { ExamsCommandService } from 'src/exams/application/exams-command.service';
import { ApiTags } from '@nestjs/swagger';
import { ExamsQueryService } from 'src/exams/application/exams-query.service';

@ApiTags('Exam')
@Controller('sections/:sectionId/exams')
export class ExamsCommandController {
  constructor(
    private readonly examCommandService: ExamsCommandService,
    private readonly examQueryService: ExamsQueryService,
    private readonly examResponseMapper: ExamResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateExamDto,
  ) {
    const createdExam = await this.examCommandService.create(sectionId, dto);

    const exam = await this.examQueryService.findById(
      sectionId,
      createdExam.id,
    );

    return {
      message: 'messages.EXAM_CREATED_SUCCESSFULLY',
      data: this.examResponseMapper.toResponseFromPrisma(exam),
    };
  }

  @Patch(':examId')
  async update(
    @Param('sectionId') sectionId: string,
    @Param('examId') examId: string,
    @Body() dto: UpdateExamDto,
  ) {
    const createdExam = await this.examCommandService.update(
      sectionId,
      examId,
      dto,
    );

    const exam = await this.examQueryService.findById(
      sectionId,
      createdExam.id,
    );

    return {
      message: 'messages.EXAM_UPDATED_SUCCESSFULLY',
      data: this.examResponseMapper.toResponseFromPrisma(exam),
    };
  }

  @Delete(':examId')
  async remove(
    @Param('sectionId') sectionId: string,
    @Param('examId') examId: string,
  ) {
    await this.examCommandService.remove(sectionId, examId);

    return {
      message: 'messages.EXAM_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
