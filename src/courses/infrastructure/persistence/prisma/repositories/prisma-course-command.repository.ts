import { Injectable } from '@nestjs/common';
import { CourseCommandRepository } from 'src/courses/application/ports/course-command.repository';
import { Course } from 'src/courses/domain/course';
import { PrismaCourseMapper } from '../mappers/prisma-course.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaCourseCommandRepository implements CourseCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaCourseMapper,
  ) {}

  async save(course: Course): Promise<void> {
    const data = this.mapper.toPersistence(course);
    await this.prisma.course.upsert({
      where: { id: course.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({ where: { id } });
  }

  async findById(id: string): Promise<Course | null> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    return course ? this.mapper.toDomain(course) : null;
  }
}
