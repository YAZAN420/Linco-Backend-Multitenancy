import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateQuestionBankDto } from './dto/create-questionsBank.dto';
import { UpdateQuestionBankDto } from './dto/update-questionsBank.dto';

import { QuestionsBankResponseMapper } from './mappers/questionBank-response.mapper';
import { QuestionsBanksCommandService } from 'src/questionBanks/application/questionsBank-command.service';

@Controller('sections/:sectionId/questionsBank')
export class QuestionsBanksCommandController {
  constructor(
    private readonly questionsBankCommandService: QuestionsBanksCommandService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateQuestionBankDto,
  ) {
    const questionsBank = await this.questionsBankCommandService.create(
      sectionId,
      dto,
    );

    return {
      message: 'QuestionsBank created successfully',
      data: this.questionsBankResponseMapper.toResponseFromDomain(
        questionsBank,
      ),
    };
  }

  @Patch(':questionsBankId')
  async update(
    @Param('sectionId') sectionId: string,
    @Param('questionsBankId') questionsBankId: string,
    @Body() dto: UpdateQuestionBankDto,
  ) {
    const questionsBank = await this.questionsBankCommandService.update(
      sectionId,
      questionsBankId,
      dto,
    );

    return {
      message: 'QuestionsBank updated successfully',
      data: this.questionsBankResponseMapper.toResponseFromDomain(
        questionsBank,
      ),
    };
  }

  @Delete(':questionsBankId')
  async remove(
    @Param('sectionId') sectionId: string,
    @Param('questionsBankId') questionsBankId: string,
  ) {
    await this.questionsBankCommandService.remove(
      sectionId,
      questionsBankId,
    );

    return {
      message: 'QuestionsBank deleted successfully',
      data: null,
    };
  }
}
