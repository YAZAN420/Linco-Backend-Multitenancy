import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PrismaExamAttemptMapper } from '../mappers/prisma-exam-attempt.mapper';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';
import { ExamAttemptQueryRepository } from 'src/exams/application/ports/exam-attempt-query.repository';
import {
  FindExamAttemptsCursorQuery,
  FindExamAttemptsQuery,
} from 'src/exams/application/interfaces/find-exam-attempts.query';

@Injectable()
export class PrismaExamAttemptQueryRepository implements ExamAttemptQueryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaExamAttemptMapper,
  ) {}

  async findAll(
    courseId: string,
    options: FindExamAttemptsQuery,
  ): Promise<PageDto<ExamAttempt>> {
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.examAttempt.findMany({
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.examAttempt.count(),
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
    const { cursor, take } = options;

    const items = await this.prisma.examAttempt.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
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
    const examAttempt = await this.prisma.examAttempt.findUnique({
      where: { id },
    });
    if (examAttempt == null) {
      return null;
    }
    return this.mapper.toDomain(examAttempt);
  }
}
