import { Controller, Get, Param, Query } from '@nestjs/common';
import { CursorPageOptionsDto } from 'src/common/dtos/pagination/cursor/cursor-page-options.dto';
import { AttachmentQueryService } from 'src/lessons/application/attachment-query.service';
import { AttachmentResponseMapper } from './mappers/attachment-response.mapper';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('ِAttachment')
@Controller('lessons/:lessonId/attachments')
export class AttachmentsQueryController {
  constructor(
    private readonly attachmentQueryService: AttachmentQueryService,
    private readonly attachmentResponseMapper: AttachmentResponseMapper,
  ) {}

  @Get('cursor')
  async findWithCursor(
    @Param('lessonId') lessonId: string,
    @Query() options: CursorPageOptionsDto,
  ) {
    const attachments = await this.attachmentQueryService.findAllCursor(
      lessonId,
      options,
    );
    return {
      message: 'Attachments fetched successfully',
      data: this.attachmentResponseMapper.toResponseManyFromPrisma(
        attachments.data,
      ),
      meta: attachments.meta,
    };
  }

  @Get(':attachmentId')
  async findOne(
    @Param('lessonId') lessonId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    const attachment = await this.attachmentQueryService.findById(
      lessonId,
      attachmentId,
    );
    return {
      message: 'Attachment retrieved successfully',
      data: this.attachmentResponseMapper.toResponseFromPrisma(attachment),
    };
  }
}
