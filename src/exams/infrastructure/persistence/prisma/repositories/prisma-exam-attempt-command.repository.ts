import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';
import { ExamAttemptCommandRepository } from 'src/exams/application/ports/exam-attempt-command.repository';
import { PrismaExamAttemptMapper } from '../mappers/prisma-exam-attempt.mapper';
import { DomainException } from 'src/common/exceptions/domain.exception';

@Injectable()
export class PrismaExamAttemptCommandRepository implements ExamAttemptCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaExamAttemptMapper,
  ) {}

  async save(examAttempt: ExamAttempt): Promise<void> {
    const exam = await this.prisma.examAttempt.findFirst({
      where: {
        userId: examAttempt.userId,
        examId: examAttempt.examId
      }
    });

    if(exam != null) {
      this.delete(exam.id);
    }
    const data = this.mapper.toPersistence(examAttempt);
    await this.prisma.examAttempt.upsert({
      where: { id: examAttempt.id },
      update: data,
      create: data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.examAttempt.delete({ where: { id } });
  }

  async findById(id: string): Promise<ExamAttempt | null> {
    const exam = await this.prisma.examAttempt.findUnique({ where: { id } });
    return exam ? this.mapper.toDomain(exam) : null;
  }
}
