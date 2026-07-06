import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

import {
  FindDepartmentCoursesCursorQuery,
  FindDepartmentCoursesQuery,
} from 'src/departmentCourses/application/interfaces/find-departmentCourses.query';
import { DepartmentCourseQueryRepository } from 'src/departmentCourses/application/ports/departmentCourse-query.repository';
import { DepartmentCourseWithAssetWithCourse } from 'src/core/database/prisma/types';
import {
  courseWithStatsInclude,
  mapDepartmentCourse,
} from 'src/core/database/prisma/utils/course-mapper.util';

@Injectable()
export class PrismaDepartmentCourseQueryRepository implements DepartmentCourseQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    options: FindDepartmentCoursesQuery,
  ): Promise<PageDto<DepartmentCourseWithAssetWithCourse>> {
    const skip = (options.page - 1) * options.take;

    const [rawItems, itemCount] = await Promise.all([
      this.prisma.departmentCourse.findMany({
        skip,
        take: options.take,
        orderBy: [{ assignedAt: 'desc' }],
        include: {
          asset: {
            include: {
              course: {
                include: courseWithStatsInclude,
              },
            },
          },
        },
      }),
      this.prisma.departmentCourse.count(),
    ]);

    const items = rawItems.map(mapDepartmentCourse);

    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindDepartmentCoursesCursorQuery,
  ): Promise<CursorPageDto<DepartmentCourseWithAssetWithCourse>> {
    const { cursor, take } = options;

    const rawItems = await this.prisma.departmentCourse.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      include: {
        asset: {
          include: {
            course: {
              include: courseWithStatsInclude,
            },
          },
        },
      },
    });

    const hasNextPage = rawItems.length > take;
    if (hasNextPage) rawItems.pop();

    const endCursor =
      rawItems.length > 0 ? rawItems[rawItems.length - 1].id : null;

    const items = rawItems.map(mapDepartmentCourse);

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(
    id: string,
  ): Promise<DepartmentCourseWithAssetWithCourse | null> {
    const departmentCourse = await this.prisma.departmentCourse.findUnique({
      where: { id },
      include: {
        asset: {
          include: {
            course: {
              include: courseWithStatsInclude,
            },
          },
        },
      },
    });
    return departmentCourse ? mapDepartmentCourse(departmentCourse) : null;
  }
}
