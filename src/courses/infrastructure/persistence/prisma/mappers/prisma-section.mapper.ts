import { Injectable } from '@nestjs/common';
import { Section } from 'src/courses/domain/section';
import type { Section as PrismaSection } from 'src/generated/prisma/client';

@Injectable()
export class PrismaSectionMapper {
  toDomain(raw: PrismaSection): Section {
    return new Section(raw.id, {
      title: raw.title,
      order: raw.order,
      courseId: raw.courseId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(section: Section): PrismaSection {
    return {
      id: section.id,
      createdAt: section.createdAt,
      updatedAt: section.updatedAt,
      title: section.title,
      order: section.order,
      courseId: section.courseId,
    };
  }
}
