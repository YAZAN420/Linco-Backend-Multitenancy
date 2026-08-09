import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateDiscussionQuestionDto } from './dto/create-discussionQuestion.dto';
import { UpdateDiscussionQuestionDto } from './dto/update-discussionQuestion.dto';

import { DiscussionQuestionResponseMapper } from './mappers/discussionQuestion-response.mapper';
import { DiscussionQuestionsCommandService } from 'src/discussionQuestions/application/discussionQuestions-command.service';

import { DiscussionQuestionsQueryService } from 'src/discussionQuestions/application/discussionQuestions-query.service';
import { ApiTags } from '@nestjs/swagger';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

@ApiTags('Qa-Question')
@UseGuards(DemoRolesGuard)
@Controller('lessons/:lessonId/discussionQuestions')
export class DiscussionQuestionsCommandController {
  constructor(
    private readonly discussionQuestionCommandService: DiscussionQuestionsCommandService,
    private readonly discussionQuestionQueryService: DiscussionQuestionsQueryService,
    private readonly discussionQuestionResponseMapper: DiscussionQuestionResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveDemoMember('id') demoMemberId: string,
    @Param('lessonId') lessonId: string,
    @Body() dto: CreateDiscussionQuestionDto,
  ) {
    const createdDiscussionQuestion =
      await this.discussionQuestionCommandService.create(
        lessonId,
        demoMemberId,
        dto,
      );
    const discussionQuestion =
      await this.discussionQuestionQueryService.findById(
        lessonId,
        createdDiscussionQuestion.id,
      );

    return {
      message: 'messages.DISCUSSION_QUESTION_CREATED_SUCCESSFULLY',
      data: this.discussionQuestionResponseMapper.toResponseFromPrisma(
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
    const updatedDiscussionQuestion =
      await this.discussionQuestionCommandService.update(
        lessonId,
        discussionQuestionId,
        dto,
      );

    const discussionQuestion =
      await this.discussionQuestionQueryService.findById(
        lessonId,
        updatedDiscussionQuestion.id,
      );

    return {
      message: 'messages.DISCUSSION_QUESTION_UPDATED_SUCCESSFULLY',
      data: this.discussionQuestionResponseMapper.toResponseFromPrisma(
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
      message: 'messages.DISCUSSION_QUESTION_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
