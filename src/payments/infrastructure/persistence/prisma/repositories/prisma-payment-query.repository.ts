import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { FindCursorQuery, FindQuery } from 'src/common/interfaces/find.query';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Payment } from 'src/generated/prisma/client';

import { PaymentQueryRepository } from 'src/payments/application/ports/payment-query.repository';

@Injectable()
export class PrismaPaymentQueryRepository implements PaymentQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(options: FindQuery): Promise<PageDto<Payment>> {
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.payment.findMany({
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.payment.count(),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindCursorQuery,
  ): Promise<CursorPageDto<Payment>> {
    const { cursor, take } = options;

    const items = await this.prisma.payment.findMany({
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

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
    });
  }
}
