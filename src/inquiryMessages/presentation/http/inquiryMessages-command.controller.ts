import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateInquiryMessageDto } from './dto/create-inquiryMessage.dto';
import { UpdateInquiryMessageDto } from './dto/update-inquiryMessage.dto';

import { InquiryMessageResponseMapper } from './mappers/inquiryMessage-response.mapper';
import { InquiryMessagesCommandService } from 'src/inquiryMessages/application/inquiryMessages-command.service';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';

@UseGuards(DemoRolesGuard)
@Controller('inquiries/:inquiryId/inquiryMessages')
export class InquiryMessagesCommandController {
  constructor(
    private readonly inquiryMessageCommandService: InquiryMessagesCommandService,
    private readonly inquiryMessageResponseMapper: InquiryMessageResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveDemoMember('demoId') demoId: string,
    @Param('inquiryId') inquiryId: string,
    @Body() dto: CreateInquiryMessageDto,
  ) {
    const inquiryMessage = await this.inquiryMessageCommandService.create(
      inquiryId,
      demoId,
      dto,
    );

    return {
      message: 'messages.INQUIRY_MESSAGE_CREATED_SUCCESSFULLY',
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
      message: 'messages.INQUIRY_MESSAGE_UPDATED_SUCCESSFULLY',
      data: this.inquiryMessageResponseMapper.toResponseFromDomain(
        inquiryMessage,
      ),
    };
  }

  @Delete(':inquiryMessageId')
  async remove(@Param('inquiryMessageId') inquiryMessageId: string) {
    await this.inquiryMessageCommandService.remove(inquiryMessageId);

    return {
      message: 'messages.INQUIRY_MESSAGE_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
