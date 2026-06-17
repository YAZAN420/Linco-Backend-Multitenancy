import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { buildOrderBy, buildWhere } from 'src/common/utils/prisma.util';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma, DepartmentCourse } from 'src/generated/prisma/client';

import {
  FindDepartmentCoursesCursorQuery,
  FindDepartmentCoursesQuery,
} from 'src/departmentCourses/application/interfaces/find-departmentCourses.query';
import { DepartmentCourseQueryRepository } from 'src/departmentCourses/application/ports/departmentCourse-query.repository';

const DEPARTMENTCOURSE_SEARCH_COLUMNS = [];
const DEPARTMENTCOURSE_ORDERABLE_FIELDS = ['createdAt'];

@Injectable()
export class PrismaDepartmentCourseQueryRepository implements DepartmentCourseQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildPrismaArgs<T extends FindDepartmentCoursesQuery | FindDepartmentCoursesCursorQuery>(
    options: T,
  ) {
    return {
      where: buildWhere<T, Prisma.DepartmentCourseWhereInput>(options, DEPARTMENTCOURSE_SEARCH_COLUMNS),
      orderBy: buildOrderBy(options.orderBy, DEPARTMENTCOURSE_ORDERABLE_FIELDS),
    };
  }

  async findAll(options: FindDepartmentCoursesQuery): Promise<PageDto<DepartmentCourse>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const skip = (options.page - 1) * options.take;

    const [items, itemCount] = await Promise.all([
      this.prisma.departmentCourse.findMany({
        skip,
        take: options.take,
        where,
        orderBy: orderBy.length > 0 ? orderBy : [{ createdAt: 'desc' }],
      }),
      this.prisma.departmentCourse.count({ where }),
    ]);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindDepartmentCoursesCursorQuery,
  ): Promise<CursorPageDto<DepartmentCourse>> {
    const { where, orderBy } = this.buildPrismaArgs(options);
    const { cursor, take } = options;

    const items = await this.prisma.departmentCourse.findMany({
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

  async findById(id: string): Promise<DepartmentCourse | null> {
    return this.prisma.departmentCourse.findUnique({
      where: { id },
    });
  }
}
