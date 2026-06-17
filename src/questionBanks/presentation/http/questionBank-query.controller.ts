import { Controller, Get, Param, Query } from '@nestjs/common';

import { QuestionsBanksQueryService } from 'src/questionBanks/application/questionsBank-query.service';

import { QuestionsBankResponseMapper } from './mappers/questionBank-response.mapper';
import { FindQuestionsBanksDto } from './dto/filters/find-questionsBank.dto';
import { FindQuestionBanksCursorDto } from './dto/filters/find-questionsBank-cursor.dto';

@Controller('courses/:courseId/sections/:sectionId/questionBanks')
export class QuestionsBanksQueryController {
  constructor(
    private readonly questionBankQueryService: QuestionsBanksQueryService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Query() options: FindQuestionsBanksDto,
  ) {
    const questionsBank = await this.questionBankQueryService.findAll(
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
    @Query() options: FindQuestionBanksCursorDto,
  ) {
    const questionsBank = await this.questionBankQueryService.findAllCursor(
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
    const questionsBank = await this.questionBankQueryService.findById(
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
