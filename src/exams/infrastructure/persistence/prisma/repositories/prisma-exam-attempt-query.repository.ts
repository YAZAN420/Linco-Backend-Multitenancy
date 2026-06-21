import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaExamAttemptMapper } from '../mappers/prisma-exam-attempt.mapper';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';
import { ExamAttemptQueryRepository } from 'src/exams/application/ports/exam-attempt-query.repository';
import { FindExamAttemptsCursorQuery, FindExamAttemptsQuery } from 'src/exams/application/interfaces/find-exam-attempts.query';

const EXAM_ATTEMPT_SEARCH_COLUMNS = [];
const EXAM_ATTEMPT_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaExamAttemptQueryRepository implements ExamAttemptQueryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaExamAttemptMapper
  ) {}

  private buildPrismaArgs<T extends FindExamAttemptsQuery | FindExamAttemptsCursorQuery>(
    options: T,
  ) {
    return {
      where: buildWhere<T, Prisma.ExamAttemptWhereInput>(options, EXAM_ATTEMPT_SEARCH_COLUMNS),
      orderBy: buildOrderBy(options.orderBy, EXAM_ATTEMPT_ORDERABLE_FIELDS),
    };
  }

  async findAll(courseId: string, options: FindExamAttemptsQuery): Promise<PageDto<ExamAttempt>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.examAttempt.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.examAttempt.count({ where }),
    ]);

    return new PageDto(
      items.map((item) => this.mapper.toDomain(item)),
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    sectionId: string,
    options: FindExamAttemptsCursorQuery,
  ): Promise<CursorPageDto<ExamAttempt>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.examAttempt.findMany({
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
      items.map((item) => this.mapper.toDomain(item)),
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(id: string): Promise<ExamAttempt | null> {
    console.log(id);
    const examAttempt = await this.prisma.examAttempt.findUnique({
      where: { id },
    });
    if(examAttempt == null) {
      return null;
    }
    return this.mapper.toDomain(examAttempt);
  }
}
