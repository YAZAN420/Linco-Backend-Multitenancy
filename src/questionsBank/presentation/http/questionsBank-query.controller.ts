import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindQuestionsBankDto } from './dto/filters/find-questionsBank.dto';
import { FindQuestionsBankCursorDto } from './dto/filters/find-questionsBank-cursor.dto';

import { QuestionsBankQueryService } from 'src/questionsBank/application/questionsBank-query.service';

import { QuestionsBankResponseMapper } from './mappers/questionsBank-response.mapper';

@Controller('questionsBank')
export class QuestionsBankQueryController {
  constructor(
    private readonly questionsBankQueryService: QuestionsBankQueryService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Get()
  async findAll(@Query() options: FindQuestionsBankDto) {
    const questionsBank = await this.questionsBankQueryService.findAll(options);
    return {
      message: 'QuestionBank fetched successfully',
      data: this.questionsBankResponseMapper.toResponseManyFromPrisma(questionsBank.data),
      meta: questionsBank.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: FindQuestionsBankCursorDto) {
    const questionsBank = await this.questionsBankQueryService.findAllCursor(options);

    return {
      message: 'QuestionBank fetched successfully (Cursor)',
      data: this.questionsBankResponseMapper.toResponseManyFromPrisma(questionsBank.data),
      meta: questionsBank.meta,
    };
  }

  @Get(':questionBankId')
  async findOne(
    @Param('questionBankId') questionsBankId: string,
  ) {
    const questionsBank = await this.questionsBankQueryService.findById(questionsBankId);

    return {
      message: 'QuestionBank retrieved successfully',
      data: this.questionsBankResponseMapper.toResponseFromPrisma(questionsBank),
    };
  }
}