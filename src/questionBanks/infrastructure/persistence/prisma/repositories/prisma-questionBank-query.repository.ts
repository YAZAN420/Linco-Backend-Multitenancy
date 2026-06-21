import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { DomainException } from 'src/common/exceptions/domain.exception';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

import {
  FindQuestionsBankCursorQuery,
  FindQuestionsBankQuery,
} from 'src/questionBanks/application/interfaces/find-questionsBank.query';
import { QuestionsBankQueryRepository } from 'src/questionBanks/application/ports/questionsBank-query.repository';
import { PrismaQuestionsBankMapper } from '../mappers/prisma-questionsBank.mapper';
import { QuestionsBank } from 'src/questionBanks/domain/questionsBank';

const QUESTIONSBANK_SEARCH_COLUMNS = [];
const QUESTIONSBANK_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaQuestionsBankQueryRepository implements QuestionsBankQueryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaQuestionsBankMapper
  ) {}

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
  ): Promise<PageDto<QuestionsBank>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.questionsBank.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
        include: { choices: true },
      }),
      this.prisma.questionsBank.count({ where }),
    ]);

    return new PageDto(
      items.map((item) => this.mapper.toDomain(item)),
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindQuestionsBankCursorQuery,
  ): Promise<CursorPageDto<QuestionsBank>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.questionsBank.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: orderBy.length > 0 ? orderBy : [{ id: 'desc' }],
      include: { choices: true },
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items.map((item) => this.mapper.toDomain(item)),
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<QuestionsBank | null> {
    const question = await this.prisma.questionsBank.findUnique({
      where: { id },
      include: { choices: true },
    });
    if(question == null) {
      throw new NotFoundException(`question with id ${id} not found`);
    }
    return this.mapper.toDomain(question);
  }
  
  async getRandomQuestions(sectionId: string, numberOfQuestions: number): Promise<QuestionsBank[]>{
    const questionsBank = await this.prisma.questionsBank.findMany({
      where: {
        sectionId: sectionId,
      },
      include: { choices: true }
    });

    if (numberOfQuestions > questionsBank.length) {
      throw new DomainException('Not enough questions available');
    }

    const randomIndexes = new Set<number>();

    while (randomIndexes.size < numberOfQuestions) {
      randomIndexes.add(Math.floor(Math.random() * questionsBank.length));
    }

    const questions = [...randomIndexes].map((index) =>
      this.mapper.toDomain(questionsBank[index])
    );
    
    return questions;
  }
}
