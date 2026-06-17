import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateQuestionsBankDto } from './dto/create-questionsBank.dto';
import { UpdateQuestionsBankDto } from './dto/update-questionsBank.dto';

import { QuestionsBankResponseMapper } from './mappers/questionsBank-response.mapper';
import { QuestionsBanksCommandService } from 'src/questionsBanks/application/questionsBank-command.service';

@Controller('courses/:courseId/sections/:sectionId/questionBanks')
export class QuestionsBanksCommandController {
  constructor(
    private readonly questionsBanksCommandService: QuestionsBanksCommandService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('courseId') courseId: string,
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateQuestionsBankDto,
  ) {
    const questionsBank = await this.questionsBanksCommandService.create(
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
    @Body() dto: UpdateQuestionsBankDto,
  ) {
    const questionsBank = await this.questionsBanksCommandService.update(
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
    await this.questionsBanksCommandService.remove(
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
