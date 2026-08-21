import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentCourseCommandRepository } from 'src/departmentCourses/application/ports/departmentCourse-command.repository';
import { DepartmentCourse } from 'src/departmentCourses/domain/departmentCourse';
import { PrismaDepartmentCourseMapper } from '../mappers/prisma-departmentCourse.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class PrismaDepartmentCourseCommandRepository implements DepartmentCourseCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaDepartmentCourseMapper,
  ) {}

  async save(departmentCourse: DepartmentCourse): Promise<void> {
    const data = this.mapper.toPersistence(departmentCourse);
    try {
      await this.prisma.departmentCourse.upsert({
        where: { id: departmentCourse.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            'errors.DEPARTMENT_COURSE_ALREADY_EXISTS',
          );
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('errors.DEPARTMENT_COURSE_NOT_FOUND');
        }
      }
      throw new InternalServerErrorException({
        message: 'errors.DATABASE_OPERATION_FAILED_ERROR',
        args: { error: String(error) },
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.departmentCourse.delete({ where: { id } });
  }

  async findById(id: string): Promise<DepartmentCourse | null> {
    const departmentCourse = await this.prisma.departmentCourse.findUnique({
      where: { id },
    });
    return departmentCourse ? this.mapper.toDomain(departmentCourse) : null;
  }
}
