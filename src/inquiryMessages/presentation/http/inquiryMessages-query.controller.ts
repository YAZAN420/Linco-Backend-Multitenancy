import { Controller, Get, Param, Query } from '@nestjs/common';

import { CursorPageOptionsDto } from 'src/common/dtos/pagination';

import { InquiryMessagesQueryService } from 'src/inquiryMessages/application/inquiryMessages-query.service';

import { InquiryMessageResponseMapper } from './mappers/inquiryMessage-response.mapper';

@Controller('inquiries/:inquiryId/inquiryMessages')
export class InquiryMessagesQueryController {
  constructor(
    private readonly inquiryMessageQueryService: InquiryMessagesQueryService,
    private readonly inquiryMessageResponseMapper: InquiryMessageResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('inquiryId') inquiryId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const inquiryMessages = await this.inquiryMessageQueryService.findAllCursor(
      inquiryId,
      options,
    );

    return {
      message: 'InquiryMessages fetched successfully',
      data: this.inquiryMessageResponseMapper.toResponseManyFromPrisma(
        inquiryMessages.data,
      ),
      meta: inquiryMessages.meta,
    };
  }

  @Get(':inquiryMessageId')
  async findOne(@Param('inquiryMessageId') inquiryMessageId: string) {
    const inquiryMessage =
      await this.inquiryMessageQueryService.findById(inquiryMessageId);

    return {
      message: 'InquiryMessage retrieved successfully',
      data: this.inquiryMessageResponseMapper.toResponseFromPrisma(
        inquiryMessage,
      ),
    };
  }
}
