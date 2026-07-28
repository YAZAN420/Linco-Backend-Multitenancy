import { Controller, Post, Body, Param, Delete } from '@nestjs/common';
import { CreateQuestionBankDto } from './dto/create-questionsBank.dto';
import { QuestionsBankResponseMapper } from './mappers/questionBank-response.mapper';
import { QuestionsBanksCommandService } from 'src/questionBanks/application/questionsBank-command.service';
import { ApiTags } from '@nestjs/swagger';
import { QuestionsBanksQueryService } from 'src/questionBanks/application/questionsBank-query.service';

@ApiTags('QuestionsBank')
@Controller('sections/:sectionId/questionsBank')
export class QuestionsBanksCommandController {
  constructor(
    private readonly questionsBankCommandService: QuestionsBanksCommandService,
    private readonly questionsBankQueryService: QuestionsBanksQueryService,
    private readonly questionsBankResponseMapper: QuestionsBankResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateQuestionBankDto,
  ) {
    const createdQuestionsBank = await this.questionsBankCommandService.create(
      sectionId,
      dto,
    );

    const questionsBank = await this.questionsBankQueryService.findById(
      sectionId,
      createdQuestionsBank.id,
    );

    return {
      message: 'messages.QUESTION_BANK_CREATED_SUCCESSFULLY',
      data: this.questionsBankResponseMapper.toResponseFromPrisma(
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
      message: 'messages.QUESTION_BANK_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
