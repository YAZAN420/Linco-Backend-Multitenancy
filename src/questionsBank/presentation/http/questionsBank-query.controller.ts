import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindQuestionsBankDto } from './dto/filters/find-questionsBank.dto';
import { FindQuestionsBankCursorDto } from './dto/filters/find-questionsBank-cursor.dto';

import { QuestionsBankQueryService } from 'src/questionsBank/application/questionsBank-query.service';

import { QuestionsBankResponseMapper } from './mappers/questionsBank-response.mapper';

@Controller('courses/:courseId/sections/:sectionId/questionBank')
export class QuestionsBankQueryController {
  constructor(
    private readonly questionsBankQueryService: QuestionsBankQueryService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Query() options: FindQuestionsBankDto,
  ) {
    const questionsBank = await this.questionsBankQueryService.findAll(
      courseId,
      sectionId,
      options,
    );
    return {
      message: 'QuestionBank fetched successfully',
      data: this.questionsBankResponseMapper.toResponseManyFromPrisma(
        questionsBank.data,
      ),
      meta: questionsBank.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Query() options: FindQuestionsBankCursorDto,
  ) {
    const questionsBank = await this.questionsBankQueryService.findAllCursor(
      courseId,
      sectionId,
      options,
    );

    return {
      message: 'QuestionBank fetched successfully (Cursor)',
      data: this.questionsBankResponseMapper.toResponseManyFromPrisma(
        questionsBank.data,
      ),
      meta: questionsBank.meta,
    };
  }

  @Get(':questionBankId')
  async findOne(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('questionBankId') questionsBankId: string,
  ) {
    const questionsBank = await this.questionsBankQueryService.findById(
      courseId,
      sectionId,
      questionsBankId,
    );

    return {
      message: 'QuestionBank retrieved successfully',
      data: this.questionsBankResponseMapper.toResponseFromPrisma(
        questionsBank,
      ),
    };
  }
}
