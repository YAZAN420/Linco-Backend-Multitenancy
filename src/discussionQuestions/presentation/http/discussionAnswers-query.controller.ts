import { Controller, Get, Param, Query } from '@nestjs/common';
import { DiscussionAnswersQueryService } from 'src/discussionQuestions/application/discussionAnswers-query.service';
import { DiscussionAnswerResponseMapper } from './mappers/discussionAnswer-response.mapper';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Qa-Answer')
@Controller('discussionQuestions/:discussionQuestionId/answers')
export class DiscussionAnswersQueryController {
  constructor(
    private readonly discussionAnswerQueryService: DiscussionAnswersQueryService,
    private readonly discussionAnswerResponseMapper: DiscussionAnswerResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('discussionQuestionId') discussionId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const discussionAnswers =
      await this.discussionAnswerQueryService.findAllCursor(
        discussionId,
        options,
      );

    return {
      message: 'messages.DISCUSSION_ANSWERS_FETCHED_SUCCESSFULLY',
      data: this.discussionAnswerResponseMapper.toResponseManyFromPrisma(
        discussionAnswers.data,
      ),
      meta: discussionAnswers.meta,
    };
  }

  @Get(':answerId')
  async findById(
    @Param('discussionQuestionId') discussionId: string,
    @Param('answerId') answerId: string,
  ) {
    const discussionAnswer =
      await this.discussionAnswerQueryService.findById(answerId);
    return {
      message: 'messages.DISCUSSION_ANSWER_RETRIEVED_SUCCESSFULLY',
      data: discussionAnswer,
    };
  }
}
