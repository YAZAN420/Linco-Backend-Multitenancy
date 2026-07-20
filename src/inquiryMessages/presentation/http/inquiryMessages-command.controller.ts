import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateInquiryMessageDto } from './dto/create-inquiryMessage.dto';
import { UpdateInquiryMessageDto } from './dto/update-inquiryMessage.dto';

import { InquiryMessageResponseMapper } from './mappers/inquiryMessage-response.mapper';
import { InquiryMessagesCommandService } from 'src/inquiryMessages/application/inquiryMessages-command.service';

@Controller('inquiryMessages')
export class InquiryMessagesCommandController {
  constructor(
    private readonly inquiryMessageCommandService: InquiryMessagesCommandService,
    private readonly inquiryMessageResponseMapper: InquiryMessageResponseMapper,
  ) {}

  @Post()
  async create(@Body() dto: CreateInquiryMessageDto) {
    const inquiryMessage = await this.inquiryMessageCommandService.create(dto);

    return {
      message: 'InquiryMessage created successfully',
      data: this.inquiryMessageResponseMapper.toResponseFromDomain(
        inquiryMessage,
      ),
    };
  }

  @Patch(':inquiryMessageId')
  async update(
    @Param('inquiryMessageId') inquiryMessageId: string,
    @Body() dto: UpdateInquiryMessageDto,
  ) {
    const inquiryMessage = await this.inquiryMessageCommandService.update(
      inquiryMessageId,
      dto,
    );

    return {
      message: 'InquiryMessage updated successfully',
      data: this.inquiryMessageResponseMapper.toResponseFromDomain(
        inquiryMessage,
      ),
    };
  }

  @Delete(':inquiryMessageId')
  async remove(@Param('inquiryMessageId') inquiryMessageId: string) {
    await this.inquiryMessageCommandService.remove(inquiryMessageId);

    return {
      message: 'InquiryMessage deleted successfully',
      data: null,
    };
  }
}
