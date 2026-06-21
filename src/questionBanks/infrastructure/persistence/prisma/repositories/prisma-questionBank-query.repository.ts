import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { QuestionsBankWithQuestionChoices } from 'src/core/database/prisma/types';
import { Prisma, QuestionsBank } from 'src/generated/prisma/client';

import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from 'src/questionBanks/application/interfaces/find-questionsBank.query';
import { QuestionsBankQueryRepository } from 'src/questionBanks/application/ports/questionsBank-query.repository';

const QUESTIONSBANK_SEARCH_COLUMNS = [];
const QUESTIONSBANK_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaQuestionsBankQueryRepository implements QuestionsBankQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<
    T extends FindQuestionsBankQuery | FindQuestionsBankCursorQuery,
  >(options: T) {
    return {
      where: buildWhere<T, Prisma.QuestionsBankWhereInput>(
        options,
        QUESTIONSBANK_SEARCH_COLUMNS,
      ),
      orderBy: buildOrderBy(options.orderBy, QUESTIONSBANK_ORDERABLE_FIELDS),
    };
  }

  async findAll(
    options: FindQuestionsBankQuery,
  ): Promise<PageDto<QuestionsBankWithQuestionChoices>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.questionsBank.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
        include: {choices: true}
      }),
      this.prisma.questionsBank.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBankWithQuestionChoices>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.questionsBank.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where,
      orderBy: orderBy.length > 0 ? orderBy : [{ id: 'desc' }],
      include: {choices: true}
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<QuestionsBankWithQuestionChoices | null> {
    return this.prisma.questionsBank.findUnique({
      where: { id },
      include: {choices: true}
    });
  }
}
