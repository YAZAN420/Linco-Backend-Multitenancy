import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { InquiryMessage } from 'src/generated/prisma/client';

import { FindInquiryMessagesCursorQuery } from 'src/inquiryMessages/application/interfaces/find-inquiryMessages.query';
import { InquiryMessageQueryRepository } from 'src/inquiryMessages/application/ports/inquiryMessage-query.repository';

@Injectable()
export class PrismaInquiryMessageQueryRepository implements InquiryMessageQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    inquiryId: string,
    options: FindInquiryMessagesCursorQuery,
  ): Promise<CursorPageDto<InquiryMessage>> {
    const { cursor, take } = options;

    const items = await this.prisma.inquiryMessage.findMany({
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

  async findById(id: string): Promise<InquiryMessage | null> {
    return this.prisma.inquiryMessage.findUnique({
      where: { id },
    });
  }
}
