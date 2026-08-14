import { Injectable } from '@nestjs/common';
import { CourseResponseDto } from '../dto/course-response.dto';
import { CourseWithStats } from 'src/core/database/prisma/types';
import { DemoResponseMapper } from 'src/demos/presentation/http/mappers/demo-response.mapper';
import { TagResponseMapper } from 'src/tags/presentation/http/mappers/tag-response.mapper';
import { CourseDashboardStats } from 'src/courses/application/interfaces/course-dashboard-stats.interface';
import { CourseDashboardStatsResponseDto } from '../dto/course-dashboard-stats-response.dto';

@Injectable()
export class CourseResponseMapper {
  constructor(
    private readonly demoResponseMapper: DemoResponseMapper,
    private readonly tagResponseMapper: TagResponseMapper,
  ) {}

  toResponseFromPrisma(course: CourseWithStats): CourseResponseDto {
    return new CourseResponseDto(
      course.id,
      course.title,
      course.visibility,
      course.price,
      course.description,
      course.imagePath,
      course.signatureImagePath,
      course.isPublished,
      course.createdAt,
      course.updatedAt,
      course._count?.sections ?? 0,
      course.totalLessons,
      course.totalDuration,
      this.tagResponseMapper.toResponseManyFromPrisma(course.tags),
      this.demoResponseMapper.toSimpleResponseFromPrisma(course.demo),
    );
  }

  toResponseManyFromPrisma(courses: CourseWithStats[]): CourseResponseDto[] {
    return courses.map((course) => this.toResponseFromPrisma(course));
  }

  toDashboardStatsResponse(
    stats: CourseDashboardStats,
  ): CourseDashboardStatsResponseDto {
    return {
      totalCourses: stats.totalCourses,
      publishedCourses: stats.publishedCourses,
      draftCourses: stats.draftCourses,
      totalEnrollments: stats.totalEnrollments,
      publicCourses: stats.publicCourses,
      privateCourses: stats.privateCourses,
    };
  }
}
