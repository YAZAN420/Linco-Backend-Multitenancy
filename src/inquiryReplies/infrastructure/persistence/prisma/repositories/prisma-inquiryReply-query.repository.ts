import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { InquiryReply } from 'src/generated/prisma/client';

import {
  FindInquiryRepliesCursorQuery,
  FindInquiryRepliesQuery,
} from 'src/inquiryReplies/application/interfaces/find-inquiryReplies.query';
import { InquiryReplyQueryRepository } from 'src/inquiryReplies/application/ports/inquiryReply-query.repository';

@Injectable()
export class PrismaInquiryReplyQueryRepository implements InquiryReplyQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    inquiryId: string,
    options: FindInquiryRepliesCursorQuery,
  ): Promise<CursorPageDto<InquiryReply>> {
    const { cursor, take } = options;

    const items = await this.prisma.inquiryReply.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      where: { inquiryId },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<InquiryReply | null> {
    return this.prisma.inquiryReply.findUnique({
      where: { id },
    });
  }
}
