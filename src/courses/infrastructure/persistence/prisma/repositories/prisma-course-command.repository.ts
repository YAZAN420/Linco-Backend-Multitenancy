import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';
import { Course } from 'src/courses/domain/course';
import { PrismaCourseMapper } from '../mappers/prisma-course.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { PrismaSectionMapper } from '../mappers/prisma-section.mapper';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaCourseCommandRepository implements CourseCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaCourseMapper,
    private readonly sectionMapper: PrismaSectionMapper,
  ) {}

  async save(course: Course): Promise<void> {
    const data = this.mapper.toPersistence(course);
    const tagsConnection = course.tagIds.map((id) => ({ id }));
    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.course.upsert({
          where: { id: course.id },
          update: {
            ...data,
            tags: { set: tagsConnection },
          },
          create: {
            ...data,
            tags: { connect: tagsConnection },
          },
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
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(
            'errors.VALIDATION_FAILED_ONE_OF_THE_RELATED_ENTITIES_E_G_CATEGORY_INSTRUCTOR_OR_COURSE_REFERENCE_DOES_NOT_EXIST',
          );
        }
      }
      throw new InternalServerErrorException({
        message:
          'errors.DATABASE_OPERATION_FAILED_WHILE_SAVING_COURSE_AGGREGATE_ERROR',
        args: { error: String(error) },
      });
    }
  }
  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({ where: { id } });
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { sections: true, tags: true },
    });
    return course ? this.mapper.toDomain(course) : null;
  }
}
