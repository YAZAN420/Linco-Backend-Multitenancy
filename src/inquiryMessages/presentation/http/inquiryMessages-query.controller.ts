import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';

import { InquiryMessagesQueryService } from 'src/inquiryMessages/application/inquiryMessages-query.service';

import { InquiryMessageResponseMapper } from './mappers/inquiryMessage-response.mapper';

@Controller('inquiryMessages')
export class InquiryMessagesQueryController {
  constructor(
    private readonly inquiryMessageQueryService: InquiryMessagesQueryService,
    private readonly inquiryMessageResponseMapper: InquiryMessageResponseMapper,
  ) {}

  @Get()
  async findAll(@Query() options: PageOptionsDto) {
    const inquiryMessages =
      await this.inquiryMessageQueryService.findAll(options);
    return {
      message: 'InquiryMessages fetched successfully',
      data: this.inquiryMessageResponseMapper.toResponseManyFromPrisma(
        inquiryMessages.data,
      ),
      meta: inquiryMessages.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(@Query() options: CursorPageOptionsDto) {
    const inquiryMessages =
      await this.inquiryMessageQueryService.findAllCursor(options);

    return {
      message: 'InquiryMessages fetched successfully (Cursor)',
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
