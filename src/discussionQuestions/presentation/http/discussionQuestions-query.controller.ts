import { Controller, Get, Param, Query } from '@nestjs/common';

import { FindDiscussionQuestionsCursorDto } from './dto/filters/find-discussionQuestions-cursor.dto';

import { DiscussionQuestionsQueryService } from 'src/discussionQuestions/application/discussionQuestions-query.service';

import { DiscussionQuestionResponseMapper } from './mappers/discussionQuestion-response.mapper';

@Controller('lessons/:lessonId/discussionQuestions')
export class DiscussionQuestionsQueryController {
  constructor(
    private readonly discussionQuestionQueryService: DiscussionQuestionsQueryService,
    private readonly discussionQuestionResponseMapper: DiscussionQuestionResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('lessonId') lessonId: string,
    @Query() options: FindDiscussionQuestionsCursorDto,
  ) {
    const discussionQuestions =
      await this.discussionQuestionQueryService.findAllCursor(options);

    return {
      message: 'DiscussionQuestions fetched successfully (Cursor)',
      data: this.discussionQuestionResponseMapper.toResponseManyFromPrisma(
        discussionQuestions.data,
      ),
      meta: discussionQuestions.meta,
    };
  }
}
