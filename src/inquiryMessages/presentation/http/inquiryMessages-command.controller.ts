import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateInquiryMessageDto } from './dto/create-inquiryMessage.dto';
import { UpdateInquiryMessageDto } from './dto/update-inquiryMessage.dto';

import { InquiryMessageResponseMapper } from './mappers/inquiryMessage-response.mapper';
import { InquiryMessagesCommandService } from 'src/inquiryMessages/application/inquiryMessages-command.service';
import { ActiveUser } from 'src/iam/presentation/http/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/domain/interfaces/active-user-data.interface';

@Controller('inquiries/:inquiryId/inquiryMessages')
export class InquiryMessagesCommandController {
  constructor(
    private readonly inquiryMessageCommandService: InquiryMessagesCommandService,
    private readonly inquiryMessageResponseMapper: InquiryMessageResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveUser() user: ActiveUserData,
    @Param('inquiryId') inquiryId: string,
    @Body() dto: CreateInquiryMessageDto,
  ) {
    const inquiryMessage = await this.inquiryMessageCommandService.create(
      inquiryId,
      user.id,
      dto,
    );

    return {
      message: 'InquiryMessage created successfully',
      data: this.inquiryMessageResponseMapper.toResponseFromDomain(
        inquiryMessage,
      ),
    };
  }

  @Patch(':inquiryMessageId')
  async update(
    @Param('inquiryId') inquiryId: string,
    @Param('inquiryMessageId') inquiryMessageId: string,
    @Body() dto: UpdateInquiryMessageDto,
  ) {
    const inquiryMessage = await this.inquiryMessageCommandService.update(
      inquiryId,
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
