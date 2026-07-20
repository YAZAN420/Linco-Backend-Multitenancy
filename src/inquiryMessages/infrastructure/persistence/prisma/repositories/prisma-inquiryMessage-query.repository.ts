import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { InquiryMessage } from 'src/generated/prisma/client';

import {
  FindInquiryMessagesCursorQuery,
  FindInquiryMessagesQuery,
} from 'src/inquiryMessages/application/interfaces/find-inquiryMessages.query';
import { InquiryMessageQueryRepository } from 'src/inquiryMessages/application/ports/inquiryMessage-query.repository';

@Injectable()
export class PrismaInquiryMessageQueryRepository implements InquiryMessageQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    options: FindInquiryMessagesQuery,
  ): Promise<PageDto<InquiryMessage>> {
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.inquiryMessage.findMany({
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.inquiryMessage.count(),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindInquiryMessagesCursorQuery,
  ): Promise<CursorPageDto<InquiryMessage>> {
    const { cursor, take } = options;

    const items = await this.prisma.inquiryMessage.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<InquiryMessage | null> {
    return this.prisma.inquiryMessage.findUnique({
      where: { id },
    });
  }
}
