import { Injectable } from '@nestjs/common';
import { Section } from 'src/courses/domain/section';
import { SectionOrder } from 'src/courses/domain/value-objects/section-order.vo';
import type { Section as PrismaSection } from 'src/generated/prisma/client';
import { Title } from 'src/courses/domain/value-objects/title.vo';

@Injectable()
export class PrismaSectionMapper {
  toDomain(raw: PrismaSection): Section {
    const titleVo = Title.fromPersistence(raw.title);
    const sectionOrderVo = SectionOrder.fromPersistence(raw.order);
    return new Section(raw.id, {
      title: titleVo,
      order: sectionOrderVo,
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
