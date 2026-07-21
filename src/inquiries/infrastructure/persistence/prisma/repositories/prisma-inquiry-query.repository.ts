import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Inquiry } from 'src/generated/prisma/client';

import { FindInquiriesCursorQuery } from 'src/inquiries/application/interfaces/find-inquiries.query';
import { InquiryQueryRepository } from 'src/inquiries/application/ports/inquiry-query.repository';

@Injectable()
export class PrismaInquiryQueryRepository implements InquiryQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    demoId: string,
    options: FindInquiriesCursorQuery,
  ): Promise<CursorPageDto<Inquiry>> {
    const { cursor, take } = options;

    const items = await this.prisma.inquiry.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      where: {
        demoId,
      },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string, demoId: string): Promise<Inquiry | null> {
    return this.prisma.inquiry.findFirst({
      where: { id, demoId },
    });
  }
}
