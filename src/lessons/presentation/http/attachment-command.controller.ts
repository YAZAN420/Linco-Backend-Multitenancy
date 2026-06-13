import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto.';
import { AttachmentCommandService } from 'src/lessons/application/attachment-command.service';
import { AttachmentResponseMapper } from './mappers/attachment-response.mapper.';

@Controller('lessons/:lessonId/attachments')
export class AttachmentsCommandController {
  constructor(
    private readonly attachmentCommandService: AttachmentCommandService,
    private readonly attachmentResponseMapper: AttachmentResponseMapper,
  ) {}

  @Post()
  async create(
    @Param('lessonId') lessonId: string,
    @Body() dto: CreateAttachmentDto,
  ) {
    const attachment = await this.attachmentCommandService.create(
      lessonId,
      dto,
    );
    return {
      message: 'Attachment created successfully',
      data: this.attachmentResponseMapper.toResponseFromDomain(attachment),
    };
  }

  @Patch(':attachmentId')
  async update(
    @Param('lessonId') lessonId: string,
    @Param('attachmentId') attachmentId: string,
    @Body() dto: UpdateAttachmentDto,
  ) {
    const attachment = await this.attachmentCommandService.update(
      lessonId,
      attachmentId,
      dto,
    );
    return {
      message: 'Attachment updated successfully',
      data: this.attachmentResponseMapper.toResponseFromDomain(attachment),
    };
  }

  @Delete(':attachmentId')
  async remove(
    @Param('lessonId') lessonId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    await this.attachmentCommandService.remove(lessonId, attachmentId);
    return {
      message: 'Attachment deleted successfully',
      data: null,
    };
  }
}
