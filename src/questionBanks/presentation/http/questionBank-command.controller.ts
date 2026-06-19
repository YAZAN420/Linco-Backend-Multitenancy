import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateQuestionBankDto } from './dto/create-questionsBank.dto';
import { UpdateQuestionBankDto } from './dto/update-questionsBank.dto';

import { QuestionsBankResponseMapper } from './mappers/questionBank-response.mapper';
import { QuestionsBanksCommandService } from 'src/questionBanks/application/questionsBank-command.service';

@Controller('courses/:courseId/sections/:sectionId/questionBanks')
export class QuestionsBanksCommandController {
  constructor(
    private readonly questionsBankCommandService: QuestionsBanksCommandService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateQuestionBankDto,
  ) {
    const questionsBank = await this.questionsBankCommandService.create(
      courseId,
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
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('questionsBankId') questionsBankId: string,
    @Body() dto: UpdateQuestionBankDto,
  ) {
    const questionsBank = await this.questionsBankCommandService.update(
      courseId,
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
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Param('questionsBankId') questionsBankId: string,
  ) {
    await this.questionsBankCommandService.remove(
      courseId,
      sectionId,
      questionsBankId,
    );

    return {
      message: 'QuestionsBank deleted successfully',
      data: null,
    };
  }
}
