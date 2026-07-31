import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CreateInquiryReplyDto } from './dto/create-inquiryReply.dto';
import { UpdateInquiryReplyDto } from './dto/update-inquiryReply.dto';

import { InquiryReplyResponseMapper } from './mappers/inquiryReply-response.mapper';
import { InquiryRepliesCommandService } from 'src/inquiryReplies/application/inquiryReplies-command.service';
import { DemoRolesGuard } from 'src/iam/presentation/http/guards/demo-roles.guard';
import { ActiveDemoMember } from 'src/iam/presentation/http/decorators/active-demo-member.decorator';

@Controller('inquiryReplies')

@UseGuards(DemoRolesGuard)
@Controller('inquiries/:inquiryId/inquiryReplies')
export class InquiryRepliesCommandController {
  constructor(
    private readonly inquiryReplyCommandService: InquiryRepliesCommandService,
    private readonly inquiryReplyResponseMapper: InquiryReplyResponseMapper,
  ) {}

  @Post()
  async create(
    @ActiveDemoMember('demoId') demoId: string,
    @Param('inquiryId') inquiryId: string,
    @Body() dto: CreateInquiryReplyDto,
  ) {
    const inquiryReply = await this.inquiryReplyCommandService.create(
      inquiryId,
      demoId,
      dto
    );

    return {
      message: 'messages.INQUIRY_REPLY_CREATED_SUCCESSFULLY',
      data: this.inquiryReplyResponseMapper.toResponseFromDomain(inquiryReply),
    };
  }

  @Patch(':inquiryReplyId')
  async update(
    @Param('inquiryId') inquiryId: string,
    @Param('inquiryReplyId') inquiryReplyId: string,
    @Body() dto: UpdateInquiryReplyDto,
  ) {
    const inquiryReply = await this.inquiryReplyCommandService.update(
      inquiryId,
      inquiryReplyId,
      dto
    );

    return {
      message: 'messages.INQUIRY_REPLY_UPDATED_SUCCESSFULLY',
      data: this.inquiryReplyResponseMapper.toResponseFromDomain(inquiryReply),
    };
  }

  @Delete(':inquiryReplyId')
  async remove(@Param('inquiryReplyId') inquiryReplyId: string) {
    await this.inquiryReplyCommandService.remove(inquiryReplyId);

    return {
      message:  'messages.INQUIRY_REPLY_DELETED_SUCCESSFULLY',
      data: null,
    };
  }
}
