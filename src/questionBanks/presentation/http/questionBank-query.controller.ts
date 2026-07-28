import { Controller, Get, Param, Query } from '@nestjs/common';

import { QuestionsBanksQueryService } from 'src/questionBanks/application/questionsBank-query.service';

import { QuestionsBankResponseMapper } from './mappers/questionBank-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('QuestionsBank')
@Controller('sections/:sectionId/questionsBank')
export class QuestionsBanksQueryController {
  constructor(
    private readonly questionBankQueryService: QuestionsBanksQueryService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

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
      message: 'messages.QUESTION_BANKS_FETCHED_SUCCESSFULLY',
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
      message: 'messages.QUESTION_BANK_RETRIEVED_SUCCESSFULLY',
      data: this.questionsBankResponseMapper.toResponseFromPrisma(
        questionsBank,
      ),
    };
  }
}
