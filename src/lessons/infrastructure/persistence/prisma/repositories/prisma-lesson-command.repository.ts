import { Injectable } from '@nestjs/common';
import { LessonCommandRepository } from 'src/lessons/application/ports/lesson-command.repository';
import { Lesson } from 'src/lessons/domain/lesson';
import { PrismaLessonMapper } from '../mappers/prisma-lesson.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaLessonCommandRepository implements LessonCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaLessonMapper,
  ) {}

  async save(lesson: Lesson): Promise<void> {
    const data = this.mapper.toPersistence(lesson);
    await this.prisma.lesson.upsert({
      where: { id: lesson.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.lesson.delete({ where: { id } });
  }

  async findById(id: string): Promise<Lesson | null> {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    return lesson ? this.mapper.toDomain(lesson) : null;
  }
}
