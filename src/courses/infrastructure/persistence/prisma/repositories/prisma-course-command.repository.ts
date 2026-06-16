import { Injectable } from '@nestjs/common';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';
import { Course } from 'src/courses/domain/course';
import { PrismaCourseMapper } from '../mappers/prisma-course.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PrismaSectionMapper } from '../mappers/prisma-section.mapper';

@Injectable()
export class PrismaCourseCommandRepository implements CourseCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaCourseMapper,
    private readonly sectionMapper: PrismaSectionMapper,
  ) {}

  async save(course: Course): Promise<void> {
    const data = this.mapper.toPersistence(course);
    await this.prisma.$transaction(async (tx) => {
      await tx.course.upsert({
        where: { id: course.id },
        update: data,
        create: data,
      });
      const sectionIds = course.sections.map((s) => s.id);

      await tx.section.deleteMany({
        where: {
          courseId: course.id,
          id: { notIn: sectionIds },
        },
      });
      for (const section of course.sections) {
        const sectionData = this.sectionMapper.toPersistence(section);
        await tx.section.upsert({
          where: { id: section.id },
          update: sectionData,
          create: sectionData,
        });
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({ where: { id } });
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { sections: true },
    });
    return course ? this.mapper.toDomain(course) : null;
  }
}
