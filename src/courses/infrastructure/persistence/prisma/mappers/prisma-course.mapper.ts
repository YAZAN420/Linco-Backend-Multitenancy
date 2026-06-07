import { Injectable } from '@nestjs/common';
import type { Course as PrismaCourse } from 'src/generated/prisma/client';
import { Course } from 'src/courses/domain/course';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';

@Injectable()
export class PrismaCourseMapper {
  toDomain(raw: PrismaCourse): Course {
    return new Course(raw.id, {
      title: raw.title,
      visibility: raw.visibility as CourseVisibility,
      price: raw.price,
      authorDemoId: raw.authorDemoId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(course: Course): PrismaCourse {
    return {
      id: course.id,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      title: course.title,
      visibility: course.visibility,
      authorDemoId: course.authorDemoId,
      price: course.price,
    };
  }
}
