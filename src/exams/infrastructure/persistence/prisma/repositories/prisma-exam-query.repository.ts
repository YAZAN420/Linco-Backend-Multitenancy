import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import { FindExamsCursorQuery } from 'src/exams/application/interfaces/find-exams.query';
import { ExamQueryRepository } from 'src/exams/application/ports/exam-query.repository';
import { Exam } from 'src/exams/domain/exam';
import { PrismaExamMapper } from '../mappers/prisma-exam.mapper';

@Injectable()
export class PrismaExamQueryRepository implements ExamQueryRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaExamMapper,
  ) {}

  async findAllCursor(
    sectionId: string,
    options: FindExamsCursorQuery,
  ): Promise<CursorPageDto<Exam>> {
    const { cursor, take } = options;

    const items = await this.prisma.exam.findMany({
      where: { sectionId },
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

    return exam ? this.mapper.toDomain(exam) : null;
  }
}
