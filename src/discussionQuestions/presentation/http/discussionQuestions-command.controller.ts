import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateDiscussionQuestionDto } from './dto/create-discussionQuestion.dto';
import { UpdateDiscussionQuestionDto } from './dto/update-discussionQuestion.dto';

import { DiscussionQuestionResponseMapper } from './mappers/discussionQuestion-response.mapper';
import { DiscussionQuestionsCommandService } from 'src/discussionQuestions/application/discussionQuestions-command.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@Controller('lessons/:lessonId/discussionQuestions')
export class DiscussionQuestionsCommandController {
  constructor(
    private readonly discussionQuestionCommandService: DiscussionQuestionsCommandService,
    private readonly discussionQuestionResponseMapper: DiscussionQuestionResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveUser() activeUser: ActiveUserData,
    @Param('lessonId') lessonId: string,
    @Body() dto: CreateDiscussionQuestionDto,
  ) {
    const discussionQuestion =
      await this.discussionQuestionCommandService.create(
        lessonId,
        activeUser.id,
        dto,
      );

    return {
      message: 'DiscussionQuestion created successfully',
      data: this.discussionQuestionResponseMapper.toResponseFromDomain(
        discussionQuestion,
      ),
    };
  }

  @Patch(':discussionQuestionId')
  async update(
    @Param('lessonId') lessonId: string,
    @Param('discussionQuestionId') discussionQuestionId: string,
    @Body() dto: UpdateDiscussionQuestionDto,
  ) {
    const discussionQuestion =
      await this.discussionQuestionCommandService.update(
        lessonId,
        discussionQuestionId,
        dto,
      );

    return {
      message: 'DiscussionQuestion updated successfully',
      data: this.discussionQuestionResponseMapper.toResponseFromDomain(
        discussionQuestion,
      ),
    };
  }

  @Delete(':discussionQuestionId')
  async remove(
    @Param('lessonId') lessonId: string,
    @Param('discussionQuestionId') discussionQuestionId: string,
  ) {
    await this.discussionQuestionCommandService.remove(
      lessonId,
      discussionQuestionId,
    );

    return {
      message: 'DiscussionQuestion deleted successfully',
      data: null,
    };
  }
}
