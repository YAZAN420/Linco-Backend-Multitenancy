import { Injectable } from '@nestjs/common';
import { DepartmentCourseCommandRepository } from 'src/departmentCourses/application/ports/departmentCourse-command.repository';
import { DepartmentCourse } from 'src/departmentCourses/domain/departmentCourse';
import { PrismaDepartmentCourseMapper } from '../mappers/prisma-departmentCourse.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaDepartmentCourseCommandRepository implements DepartmentCourseCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDepartmentCourseMapper,
  ) {}

  async save(departmentCourse: DepartmentCourse): Promise<void> {
    const data = this.mapper.toPersistence(departmentCourse);
    await this.prisma.departmentCourse.upsert({
      where: { id: departmentCourse.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.departmentCourse.delete({ where: { id } });
  }

  async findById(id: string): Promise<DepartmentCourse | null> {
    const departmentCourse = await this.prisma.departmentCourse.findUnique({ where: { id } });
    return departmentCourse ? this.mapper.toDomain(departmentCourse) : null;
  }
}
