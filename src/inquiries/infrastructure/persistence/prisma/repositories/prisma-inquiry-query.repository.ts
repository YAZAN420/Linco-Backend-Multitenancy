import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Inquiry } from 'src/generated/prisma/client';

import {
  FindInquiriesCursorQuery,
  FindInquiriesQuery,
} from 'src/inquiries/application/interfaces/find-inquiries.query';
import { InquiryQueryRepository } from 'src/inquiries/application/ports/inquiry-query.repository';

@Injectable()
export class PrismaInquiryQueryRepository implements InquiryQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: FindInquiriesQuery): Promise<PageDto<Inquiry>> {
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.inquiry.findMany({
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.inquiry.count(),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindInquiriesCursorQuery,
  ): Promise<CursorPageDto<Inquiry>> {
    const { cursor, take } = options;

    const items = await this.prisma.inquiry.findMany({
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

  async findById(id: string): Promise<Inquiry | null> {
    return this.prisma.inquiry.findUnique({
      where: { id },
    });
  }
}
