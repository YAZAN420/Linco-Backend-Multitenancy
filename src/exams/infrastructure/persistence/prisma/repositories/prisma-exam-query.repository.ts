import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import {
  FindExamsCursorQuery,
  FindExamsQuery,
} from 'src/exams/application/interfaces/find-exams.query';
import { ExamQueryRepository } from 'src/exams/application/ports/exam-query.repository';
import { Exam } from 'src/exams/domain/exam';
import { PrismaExamMapper } from '../mappers/prisma-exam.mapper';

@Injectable()
export class PrismaExamQueryRepository implements ExamQueryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaExamMapper,
  ) {}

  async findAll(options: FindExamsQuery): Promise<PageDto<Exam>> {
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.exam.findMany({
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
      }),
      this.prisma.exam.count(),
    ]);

    return new PageDto(
      items.map((item) => this.mapper.toDomain(item)),
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindExamsCursorQuery,
  ): Promise<CursorPageDto<Exam>> {
    const { cursor, take } = options;

    const items = await this.prisma.exam.findMany({
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

  async findById(id: string): Promise<Exam | null> {
    const exam = await this.prisma.exam.findUnique({
      where: { id },
    });
    if (exam == null) {
      throw new NotFoundException('exam not found');
    }
    return this.mapper.toDomain(exam);
  }
}
