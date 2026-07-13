import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

import { InquiryResponseMapper } from './mappers/inquiry-response.mapper';
import { InquiriesCommandService } from 'src/inquiries/application/inquiries-command.service';

@Controller('demo/:demoId/inquiries')
export class InquiriesCommandController {
  constructor(
    private readonly inquiryCommandService: InquiriesCommandService,
    private readonly inquiryResponseMapper: InquiryResponseMapper,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateInquiryDto,
    @Param('demoId') demoId: string
  ) {
    const inquiry = await this.inquiryCommandService.create(dto, demoId);

    return {
      message: 'Inquiry created successfully',
      data: this.inquiryResponseMapper.toResponseFromDomain(inquiry),
    };
  }

  @Patch(':inquiryId')
  async update(
    @Param('inquiryId') inquiryId: string, 
    @Body() dto: UpdateInquiryDto,
    @Param('demoId') demoId: string
  ) {
    const inquiry = await this.inquiryCommandService.update(inquiryId, dto, demoId);

    return {
      message: 'Inquiry updated successfully',
      data: this.inquiryResponseMapper.toResponseFromDomain(inquiry),
    };
  }

  @Delete(':inquiryId')
  async remove(
    @Param('inquiryId') inquiryId: string,
    @Param('demoId') demoId: string
  ) {
    await this.inquiryCommandService.remove(inquiryId, demoId);

    return {
      message: 'Inquiry deleted successfully',
      data: null,
    };
  }
}
