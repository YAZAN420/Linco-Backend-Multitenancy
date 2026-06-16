import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateQuestionsBankDto } from './dto/create-questionsBank.dto';
import { UpdateQuestionsBankDto } from './dto/update-questionsBank.dto';

import { QuestionsBankResponseMapper } from './mappers/questionsBank-response.mapper';
import { QuestionsBankCommandService } from 'src/questionsBank/application/questionsBank-command.service';

@Controller('questionsBank')
export class QuestionsBankCommandController {
  constructor(
    private readonly questionsBankCommandService: QuestionsBankCommandService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateQuestionsBankDto) {
    const questionsBank = await this.questionsBankCommandService.create(dto);

    return {
      message: 'QuestionsBank created successfully',
      data: this.questionsBankResponseMapper.toResponseFromDomain(questionsBank),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateQuestionsBankDto) {
    const questionsBank = await this.questionsBankCommandService.update(id, dto);

    return {
      message: 'QuestionsBank updated successfully',
      data: this.questionsBankResponseMapper.toResponseFromDomain(questionsBank),
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.questionsBankCommandService.remove(id);

    return {
      message: 'QuestionsBank deleted successfully',
      data: null,
    };
  }
}
