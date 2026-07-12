import { Injectable } from '@nestjs/common';
import { CourseFaqCommandRepository } from 'src/courseFaqs/application/ports/courseFaq-command.repository';
import { CourseFaq } from 'src/courseFaqs/domain/courseFaq';
import { PrismaCourseFaqMapper } from '../mappers/prisma-courseFaq.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaCourseFaqCommandRepository implements CourseFaqCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaCourseFaqMapper,
  ) {}

  async save(courseFaq: CourseFaq): Promise<void> {
    const data = this.mapper.toPersistence(courseFaq);
    await this.prisma.courseFaq.upsert({
      where: { id: courseFaq.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.courseFaq.delete({ where: { id } });
  }

  async findById(id: string): Promise<CourseFaq | null> {
    const courseFaq = await this.prisma.courseFaq.findUnique({ where: { id } });
    return courseFaq ? this.mapper.toDomain(courseFaq) : null;
  }
}
