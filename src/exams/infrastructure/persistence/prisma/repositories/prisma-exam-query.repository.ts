import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, Exam } from 'src/generated/prisma/client';

import {
  FindExamsCursorQuery,
  FindExamsQuery,
} from 'src/exams/application/interfaces/find-exams.query';
import { ExamQueryRepository } from 'src/exams/application/ports/exam-query.repository';

const EXAM_SEARCH_COLUMNS = [];
const EXAM_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaExamQueryRepository implements ExamQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<T extends FindExamsQuery | FindExamsCursorQuery>(
    options: T,
  ) {
    return {
      where: buildWhere<T, Prisma.ExamWhereInput>(options, EXAM_SEARCH_COLUMNS),
      orderBy: buildOrderBy(options.orderBy, EXAM_ORDERABLE_FIELDS),
    };
  }

  async findAll(options: FindExamsQuery): Promise<PageDto<Exam>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.exam.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.exam.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindExamsCursorQuery,
  ): Promise<CursorPageDto<Exam>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.exam.findMany({
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

  async findById(id: string): Promise<Exam | null> {
    return this.prisma.exam.findUnique({
      where: { id },
    });
  }
}
