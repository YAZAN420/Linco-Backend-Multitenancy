import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindQuestionsBankDto } from './dto/filters/find-questionsBank.dto';
import { FindQuestionsBankCursorDto } from './dto/filters/find-questionsBank-cursor.dto';

import { QuestionsBankQueryService } from 'src/questionsBank/application/questionsBank-query.service';

import { QuestionsBankResponseMapper } from './mappers/questionsBank-response.mapper';
import { WithRealtionsDto } from 'src/common/dtos/with-realtions.dto';

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
      message: 'QuestionsBank fetched successfully',
      data: this.questionsBankResponseMapper.toResponseManyFromPrisma(questionsBank.data),
      meta: questionsBank.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: FindQuestionsBankCursorDto) {
    const questionsBank = await this.questionsBankQueryService.findAllCursor(options);

    return {
      message: 'QuestionsBank fetched successfully (Cursor)',
      data: this.questionsBankResponseMapper.toResponseManyFromPrisma(questionsBank.data),
      meta: questionsBank.meta,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Query() withRelations?: WithRealtionsDto,
  ) {
    const questionsBank = await this.questionsBankQueryService.findById(id, withRelations);

    return {
      message: 'QuestionsBank retrieved successfully',
      data: this.questionsBankResponseMapper.toResponseFromPrisma(questionsBank),
    };
  }
}