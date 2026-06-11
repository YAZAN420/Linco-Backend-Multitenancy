import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, Course } from 'src/generated/prisma/browser';
import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from 'src/courses/application/interfaces/find-courses.query';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';

const COURSE_SEARCH_COLUMNS = [];
const COURSE_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaCourseQueryRepository implements CourseQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<T extends FindCoursesQuery | FindCoursesCursorQuery>(
    options: T,
  ) {
    return {
      where: buildWhere<T, Prisma.CourseWhereInput>(
        options,
        COURSE_SEARCH_COLUMNS,
      ),
      orderBy: buildOrderBy(options.orderBy, COURSE_ORDERABLE_FIELDS),
    };
  }

  async findAll(options: FindCoursesQuery): Promise<PageDto<Course>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.course.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<Course>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.course.findMany({
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

  async findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
    });
  }
}
