import { Controller, Get, Param, Query } from '@nestjs/common';

import { ExamsQueryService } from 'src/exams/application/exams-query.service';

import { ExamResponseMapper } from './mappers/exam-response.mapper';

import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Exam')
@Controller('sections/:sectionId/exams')
export class ExamsQueryController {
  constructor(
    private readonly examQueryService: ExamsQueryService,
    private readonly examResponseMapper: ExamResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Param('sectionId') sectionId: string,
    @Query() options: PageOptionsDto,
  ) {
    const exams = await this.examQueryService.findAll(sectionId, options);
    return {
      message: 'Exams fetched successfully',
      data: this.examResponseMapper.toResponseManyFromPrisma(exams.data),
      meta: exams.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(
    @Param('sectionId') sectionId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const exams = await this.examQueryService.findAllCursor(sectionId, options);

    return {
      message: 'Exams fetched successfully ',
      data: this.examResponseMapper.toResponseManyFromPrisma(exams.data),
      meta: exams.meta,
    };
  }

  @Get(':examId')
  async findOne(
    @Param('sectionId') sectionId: string,
    @Param('examId') examId: string,
  ) {
    const exam = await this.examQueryService.findById(sectionId, examId);

    return {
      message: 'Exam retrieved successfully',
      data: this.examResponseMapper.toResponseFromDomain(exam),
    };
  }
}
