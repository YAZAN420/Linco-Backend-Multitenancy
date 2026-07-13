import { Controller, Get, Param, Query } from '@nestjs/common';

import {
  CursorPageOptionsDto,
  PageOptionsDto,
} from 'src/common/dtos/pagination';

import { InquiriesQueryService } from 'src/inquiries/application/inquiries-query.service';

import { InquiryResponseMapper } from './mappers/inquiry-response.mapper';

@Controller('demo/:demoId/inquiries')
export class InquiriesQueryController {
  constructor(
    private readonly inquiryQueryService: InquiriesQueryService,
    private readonly inquiryResponseMapper: InquiryResponseMapper,
  ) {}

  @Get()
  async findAll(
    @Query() options: PageOptionsDto,
    @Param('demoId') demoId: string,
  ) {
    const inquiries = await this.inquiryQueryService.findAll(options, demoId);
    return {
      message: 'Inquiries fetched successfully',
      data: this.inquiryResponseMapper.toResponseManyFromPrisma(inquiries.data),
      meta: inquiries.meta,
    };
  }

  @Get('cursor')
  async findWithCursor(
    @Query() options: CursorPageOptionsDto,
    @Param('demoId') demoId: string,
  ) {
    const inquiries = await this.inquiryQueryService.findAllCursor(
      options,
      demoId,
    );

    return {
      message: 'Inquiries fetched successfully (Cursor)',
      data: this.inquiryResponseMapper.toResponseManyFromPrisma(inquiries.data),
      meta: inquiries.meta,
    };
  }

  @Get(':inquiryId')
  async findOne(
    @Param('inquiryId') inquiryId: string,
    @Param('demoId') demoId: string,
  ) {
    const inquiry = await this.inquiryQueryService.findById(inquiryId, demoId);

    return {
      message: 'Inquiry retrieved successfully',
      data: this.inquiryResponseMapper.toResponseFromPrisma(inquiry),
    };
  }
}
