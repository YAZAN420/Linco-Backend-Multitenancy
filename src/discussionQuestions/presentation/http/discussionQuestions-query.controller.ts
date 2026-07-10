import { Controller, Get, Param, Query } from '@nestjs/common';

import { DiscussionQuestionsQueryService } from 'src/discussionQuestions/application/discussionQuestions-query.service';

import { DiscussionQuestionResponseMapper } from './mappers/discussionQuestion-response.mapper';

import { CursorPageOptionsDto } from 'src/common/dtos/pagination';

@Controller('lessons/:lessonId/discussionQuestions')
export class DiscussionQuestionsQueryController {
  constructor(
    private readonly discussionQuestionQueryService: DiscussionQuestionsQueryService,
    private readonly discussionQuestionResponseMapper: DiscussionQuestionResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('lessonId') lessonId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const discussionQuestions =
      await this.discussionQuestionQueryService.findAllCursor(
        lessonId,
        options,
      );

    return {
      message: 'DiscussionQuestions fetched successfully (Cursor)',
      data: this.discussionQuestionResponseMapper.toResponseManyFromPrisma(
        discussionQuestions.data,
      ),
      meta: discussionQuestions.meta,
    };
  }

  @Get(':discussionQuestionId')
  async findById(
    @Param('lessonId') lessonId: string,
    @Param('discussionQuestionId') discussionQuestionId: string,
  ) {
    const discussionQuestion =
      await this.discussionQuestionQueryService.findById(
        lessonId,
        discussionQuestionId,
      );

    return {
      message: 'DiscussionQuestion fetched successfully',
      data: this.discussionQuestionResponseMapper.toResponseFromPrisma(
        discussionQuestion,
      ),
    };
  }
}
