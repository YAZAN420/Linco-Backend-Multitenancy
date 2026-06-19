import { Injectable } from '@nestjs/common';
import { ExamCommandRepository } from 'src/exams/application/ports/exam-command.repository';
import { Exam } from 'src/exams/domain/exam';
import { PrismaExamMapper } from '../mappers/prisma-exam.mapper';
import { PrismaService } from 'src/core/database/prisma/prisma.service';

@Injectable()
export class PrismaExamCommandRepository implements ExamCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaExamMapper,
  ) {}

  async save(exam: Exam): Promise<void> {
    const data = this.mapper.toPersistence(exam);
    await this.prisma.exam.upsert({
      where: { id: exam.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exam.delete({ where: { id } });
  }

  async findById(id: string): Promise<Exam | null> {
    const exam = await this.prisma.exam.findUnique({ where: { id } });
    return exam ? this.mapper.toDomain(exam) : null;
  }
}
