import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateDiscussionAnswerDto } from './dto/create-discussionAnswer.dto';
import { UpdateDiscussionAnswerDto } from './dto/update-discussionAnswer.dto';
import { DiscussionAnswerResponseMapper } from './mappers/discussionAnswer-response.mapper';
import { DiscussionAnswersCommandService } from 'src/discussionQuestions/application/discussionAnswers-command.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';
import { DiscussionAnswersQueryService } from 'src/discussionQuestions/application/discussionAnswers-query.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Qa-Answer')
@Controller('discussionQuestions/:discussionQuestionId/answers')
export class DiscussionAnswersCommandController {
  constructor(
    private readonly discussionAnswerCommandService: DiscussionAnswersCommandService,
    private readonly discussionAnswerQueryService: DiscussionAnswersQueryService,
    private readonly discussionAnswerResponseMapper: DiscussionAnswerResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveUser() activeUser: ActiveUserData,
    @Param('discussionQuestionId') discussionId: string,
    @Body() dto: CreateDiscussionAnswerDto,
  ) {
    const createdAnswer = await this.discussionAnswerCommandService.create(
      discussionId,
      activeUser.id,
      dto,
    );
    const answer = await this.discussionAnswerQueryService.findById(
      createdAnswer.id,
    );

    return {
      message: 'messages.DISCUSSION_ANSWER_CREATED_SUCCESSFULLY',
      data: this.discussionAnswerResponseMapper.toResponseFromPrisma(answer),
    };
  }

  @Patch(':answerId')
  async update(
    @Param('discussionQuestionId') discussionId: string,
    @Param('answerId') answerId: string,
    @Body() dto: UpdateDiscussionAnswerDto,
  ) {
    const updatedAnswer = await this.discussionAnswerCommandService.update(
      answerId,
      dto,
    );
    const answer = await this.discussionAnswerQueryService.findById(
      updatedAnswer.id,
    );

    return {
      message: 'messages.DISCUSSION_ANSWER_UPDATED_SUCCESSFULLY',
      data: this.discussionAnswerResponseMapper.toResponseFromPrisma(answer),
    };
  }

  @Delete(':answerId')
  async remove(
    @Param('discussionQuestionId') discussionId: string,
    @Param('answerId') answerId: string,
  ) {
    await this.discussionAnswerCommandService.remove(answerId);
    return {
      message: 'messages.DISCUSSION_ANSWER_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
