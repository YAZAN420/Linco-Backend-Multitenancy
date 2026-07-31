import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { CursorPageOptionsDto } from 'src/common/dtos/pagination';

import { InquiryRepliesQueryService } from 'src/inquiryReplies/application/inquiryReplies-query.service';

import { InquiryReplyResponseMapper } from './mappers/inquiryReply-response.mapper';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';

@UseGuards(DemoRolesGuard)
@Controller('inquiries/:inquiryId/inquiryReplies')
export class InquiryRepliesQueryController {
  constructor(
    private readonly inquiryReplyQueryService: InquiryRepliesQueryService,
    private readonly inquiryReplyResponseMapper: InquiryReplyResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('inquiryId') inquiryId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const inquiryReplies = await this.inquiryReplyQueryService.findAllCursor(
      inquiryId,
      options,
    );

    return {
      message: 'messages.INQUIRY_REPLIES_FETCHED_SUCCESSFULLY',
      data: this.inquiryReplyResponseMapper.toResponseManyFromPrisma(
        inquiryReplies.data,
      ),
      meta: inquiryReplies.meta,
    };
  }

  @Get(':inquiryReplyId')
  async findOne(@Param('inquiryReplyId') inquiryReplyId: string) {
    const inquiryReply =
      await this.inquiryReplyQueryService.findById(inquiryReplyId);

    return {
      message: 'messages.INQUIRY_REPLY_RETRIEVED_SUCCESSFULLY',
      data: this.inquiryReplyResponseMapper.toResponseFromPrisma(inquiryReply),
    };
  }
}
