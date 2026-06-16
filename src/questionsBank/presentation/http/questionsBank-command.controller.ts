import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateQuestionsBankDto } from './dto/create-questionsBank.dto';
import { UpdateQuestionsBankDto } from './dto/update-questionsBank.dto';

import { QuestionsBankResponseMapper } from './mappers/questionsBank-response.mapper';
import { QuestionsBankCommandService } from 'src/questionsBank/application/questionsBank-command.service';

@Controller('sections/:sectionId/questionBank')
export class QuestionsBankCommandController {
  constructor(
    private readonly questionsBankCommandService: QuestionsBankCommandService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateQuestionsBankDto,
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
    @Body() dto: UpdateQuestionsBankDto,
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
    await this.questionsBankCommandService.remove(sectionId, questionsBankId);

    return {
      message: 'QuestionsBank deleted successfully',
      data: null,
    };
  }
}
