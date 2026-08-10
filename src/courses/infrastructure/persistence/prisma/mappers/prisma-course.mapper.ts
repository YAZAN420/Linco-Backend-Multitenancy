import { Injectable } from '@nestjs/common';
import type { Course as PrismaCourse } from 'src/generated/prisma/client';
import { Course } from 'src/courses/domain/course';
import { CourseVisibility } from 'src/courses/domain/enums/course-visibility.enum';
import { PrismaSectionMapper } from './prisma-section.mapper';
import { Title } from 'src/courses/domain/value-objects/title.vo';
import { Price } from 'src/courses/domain/value-objects/price.vo';
import { CourseWithSections } from 'src/core/database/prisma/types';

@Injectable()
export class PrismaCourseMapper {
  constructor(private readonly sectionMapper: PrismaSectionMapper) {}
  toDomain(raw: CourseWithSections): Course {
    const titleVo = Title.fromPersistence(raw.title);
    const priceVo = Price.fromPersistence(raw.price);

    return new Course(raw.id, {
      title: titleVo,
      visibility: raw.visibility as CourseVisibility,
      price: priceVo,
      sections: raw.sections
        ? raw.sections.map((section) => this.sectionMapper.toDomain(section))
        : [],
      isPublished: raw.isPublished,
      tagIds: raw.tags ? raw.tags.map((tag) => tag.id) : [],
      description: raw.description,
      imagePath: raw.imagePath,
      signatureImagePath: raw.signatureImagePath,
      demoId: raw.demoId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(course: Course): PrismaCourse {
    return {
      id: course.id,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      imagePath: course.imagePath,
      signatureImagePath: course.signatureImagePath,
      isPublished: course.isPublished,
      description: course.description,
      title: course.title,
      visibility: course.visibility,
      demoId: course.demoId,
      price: course.price,
    };
  }
}
