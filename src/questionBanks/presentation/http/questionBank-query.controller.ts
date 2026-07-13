import { Controller, Get, Param, Query } from '@nestjs/common';

import { QuestionsBanksQueryService } from 'src/questionBanks/application/questionsBank-query.service';

import { QuestionsBankResponseMapper } from './mappers/questionBank-response.mapper';
import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';

@Controller('sections/:sectionId/questionsBank')
export class QuestionsBanksQueryController {
  constructor(
    private readonly questionBankQueryService: QuestionsBanksQueryService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Param('sectionId') sectionId: string,
    @Query() options: PageOptionsDto,
  ) {
    const questionsBank = await this.questionBankQueryService.findAll(
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
    @Param('sectionId') sectionId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const questionsBank = await this.questionBankQueryService.findAllCursor(
      sectionId,
      options,
    );

    return {
      message: 'QuestionBank fetched successfully ',
      data: this.questionsBankResponseMapper.toResponseManyFromPrisma(
        questionsBank.data,
      ),
      meta: questionsBank.meta,
    };
  }

  @Get(':questionBankId')
  async findOne(
    @Param('sectionId') sectionId: string,
    @Param('questionBankId') questionsBankId: string,
  ) {
    const questionsBank = await this.questionBankQueryService.findById(
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
