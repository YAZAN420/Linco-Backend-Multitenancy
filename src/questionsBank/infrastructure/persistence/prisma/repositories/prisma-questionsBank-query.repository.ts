import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, QuestionBank } from 'src/generated/prisma/client';

import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from 'src/questionsBank/application/interfaces/find-questionsBank.query';
import { QuestionsBankQueryRepository } from 'src/questionsBank/application/ports/questionsBank-query.repository';

const QUESTIONSBANK_SEARCH_COLUMNS = [];
const QUESTIONSBANK_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaQuestionsBankQueryRepository implements QuestionsBankQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<
    T extends FindQuestionsBankQuery | FindQuestionsBankCursorQuery,
  >(options: T) {
    return {
      where: buildWhere<T, Prisma.QuestionBankWhereInput>(
        options,
        QUESTIONSBANK_SEARCH_COLUMNS,
      ),
      orderBy: buildOrderBy(options.orderBy, QUESTIONSBANK_ORDERABLE_FIELDS),
    };
  }

  async findAll(
    options: FindQuestionsBankQuery,
  ): Promise<PageDto<QuestionBank>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.questionBank.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.questionBank.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionBank>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.questionBank.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy: orderBy.length > 0 ? orderBy : [{ id: 'desc' }],
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<QuestionBank | null> {
    return this.prisma.questionBank.findUnique({
      where: { id },
    });
  }
}
