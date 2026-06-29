import { Injectable } from '@nestjs/common';
import { CourseResponseDto } from '../dto/course-response.dto';
import { Course as DomainCourse } from 'src/courses/domain/course';
import { CourseWithDemo } from 'src/core/database/prisma/types';
import { DemoResponseMapper } from 'src/demos/presentation/http/mappers/demo-response.mapper';

@Injectable()
export class CourseResponseMapper {
  constructor(private readonly demoResponseMapper: DemoResponseMapper) {}
  toResponseFromPrisma(course: CourseWithDemo): CourseResponseDto {
    return new CourseResponseDto(
      course.id,
      course.title,
      course.visibility,
      course.price,
      course.description,
      course.imagePath,
      course.createdAt,
      course.updatedAt,
      this.demoResponseMapper.toSimpleResponseFromPrisma(course.demo),
    );
  }

  toResponseFromDomain(course: DomainCourse): CourseResponseDto {
    return new CourseResponseDto(
      course.id,
      course.title,
      course.visibility,
      course.price,
      course.description,
      course.imagePath,
      course.createdAt,
      course.updatedAt,
    );
  }

  toResponseManyFromPrisma(courses: CourseWithDemo[]): CourseResponseDto[] {
    return courses.map((course) => this.toResponseFromPrisma(course));
  }
}
