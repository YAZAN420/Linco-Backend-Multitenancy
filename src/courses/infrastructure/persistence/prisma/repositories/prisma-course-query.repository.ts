import { Injectable } from '@nestjs/common';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { CursorPageDto } from 'src/common/dtos/pagination/cursor/cursor-page.dto';
import { PageMetaDto } from 'src/common/dtos/pagination/offset/page-meta.dto';
import { PageDto } from 'src/common/dtos/pagination/offset/page.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import {
  FindCoursesCursorQuery,
  FindCoursesQuery,
} from 'src/courses/application/interfaces/find-courses.query';
import { CourseQueryRepository } from 'src/courses/application/ports/course-query.repository';
import { FindSectionsCursorQuery } from 'src/courses/application/interfaces/find-sections.query';
import { CourseVisibility, Prisma, Section } from 'src/generated/prisma/client';
import {
  CourseWithStats,
  SectionWithExamAndQuestionCount,
} from 'src/core/database/prisma/types';
import {
  courseWithStatsInclude,
  mapCourseToCourseWithStats,
} from 'src/core/database/prisma/utils/course-mapper.util';
import { CourseFilter } from 'src/courses/application/interfaces/course-filter.interface';

@Injectable()
export class PrismaCourseQueryRepository implements CourseQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhereClause(filter: CourseFilter): Prisma.CourseWhereInput {
    const { search, tagIds } = filter;

    const where: Prisma.CourseWhereInput = {
      isPublished: true,
      visibility: CourseVisibility.PUBLIC,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          id: { in: tagIds },
        },
      };
    }

    return where;
  }

  async findAll(options: FindCoursesQuery): Promise<PageDto<CourseWithStats>> {
    const skip = (options.page - 1) * options.take;
    const where = this.buildWhereClause(options);

    const [rawItems, itemCount] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take: options.take,
        orderBy: [{ createdAt: 'desc' }],
        include: courseWithStatsInclude,
        where,
      }),
      this.prisma.course.count({
        where: {
          isPublished: true,
          visibility: CourseVisibility.PUBLIC,
        },
      }),
    ]);
    const items = rawItems.map(mapCourseToCourseWithStats);
    return new PageDto(
      items,
      new PageMetaDto({ itemCount, pageOptionsDto: options }),
    );
  }

  async findAllCursor(
    options: FindCoursesCursorQuery,
  ): Promise<CursorPageDto<CourseWithStats>> {
    const { cursor, take } = options;
    const where = this.buildWhereClause(options);
    const rawItems = await this.prisma.course.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ id: 'desc' }],
      where,
      include: courseWithStatsInclude,
    });

    const hasNextPage = rawItems.length > take;
    if (hasNextPage) rawItems.pop();

    const endCursor =
      rawItems.length > 0 ? rawItems[rawItems.length - 1].id : null;

    const items = rawItems.map(mapCourseToCourseWithStats);

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findById(
    id: string,
    checkVisibility = true,
  ): Promise<CourseWithStats | null> {
    const course = await this.prisma.course.findFirst({
      where: {
        id,
        ...(checkVisibility && {
          isPublished: true,
          visibility: CourseVisibility.PUBLIC,
        }),
      },
      include: courseWithStatsInclude,
    });

    return course ? mapCourseToCourseWithStats(course) : null;
  }

  async findSectionsCursor(
    courseId: string,
    options: FindSectionsCursorQuery,
  ): Promise<CursorPageDto<Section>> {
    const { cursor, take } = options;

    const items = await this.prisma.section.findMany({
      take: take + 1,
      skip: cursor ? 1 : 0,
      where: { courseId },
      cursor: cursor ? { id: cursor } : undefined,
    });

    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();

    const endCursor = items.length > 0 ? items[items.length - 1].id : null;

    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  async findSectionById(sectionId: string): Promise<Section | null> {
    return this.prisma.section.findUnique({
      where: { id: sectionId },
    });
  }

  async findSectionWithExamAndQuestionCount(
    sectionId: string,
  ): Promise<SectionWithExamAndQuestionCount | null> {
    return this.prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        exam: true,
        _count: { select: { questionsBank: true } },
      },
    });
  }
}
