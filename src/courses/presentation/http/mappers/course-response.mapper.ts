import { Injectable } from '@nestjs/common';
import { CourseResponseDto } from '../dto/course-response.dto';
import { Course as DomainCourse } from 'src/courses/domain/course';
import { CourseWithDemo } from 'src/core/database/prisma/types';

@Injectable()
export class CourseResponseMapper {
  toResponseFromPrisma(course: CourseWithDemo): CourseResponseDto {
    return new CourseResponseDto(
      course.id,
      course.title,
      course.visibility,
      course.price,
      course.createdAt,
      course.updatedAt,
      course.demo,
    );
  }

  toResponseFromDomain(course: DomainCourse): CourseResponseDto {
    return new CourseResponseDto(
      course.id,
      course.title,
      course.visibility,
      course.price,
      course.createdAt,
      course.updatedAt,
    );
  }

  toResponseManyFromPrisma(courses: CourseWithDemo[]): CourseResponseDto[] {
    return courses.map((course) => this.toResponseFromPrisma(course));
  }
}
