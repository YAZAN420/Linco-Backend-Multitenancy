import { Injectable } from '@nestjs/common';
import { CourseResponseDto } from '../dto/course-response.dto';
import { Course as PrismaCourse } from 'src/generated/prisma/client';
import { Course as DomainCourse } from 'src/courses/domain/course';

@Injectable()
export class CourseResponseMapper {
  toResponseFromPrisma(course: PrismaCourse): CourseResponseDto {
    return new CourseResponseDto(
      course.id,
      course.title,
      course.visibility,
      course.authorDemoId,
      course.price,
      course.createdAt,
      course.updatedAt,
    );
  }

  toResponseFromDomain(course: DomainCourse): CourseResponseDto {
    return new CourseResponseDto(
      course.id,
      course.title,
      course.visibility,
      course.authorDemoId,
      course.price,
      course.createdAt,
      course.updatedAt,
    );
  }

  toResponseManyFromPrisma(courses: PrismaCourse[]): CourseResponseDto[] {
    return courses.map((course) => this.toResponseFromPrisma(course));
  }
}
