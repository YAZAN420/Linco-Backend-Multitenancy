import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';
import { ExamAttemptCommandRepository } from 'src/exams/application/ports/exam-attempt-command.repository';
import { PrismaExamAttemptMapper } from '../mappers/prisma-exam-attempt.mapper';
import { Prisma } from 'src/generated/prisma/client';

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
        examId: examAttempt.examId,
      },
    });

    if (exam != null) {
      await this.delete(exam.id);
    }
    const data = this.mapper.toPersistence(examAttempt);
    try {
      await this.prisma.examAttempt.upsert({
        where: { id: examAttempt.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException(`Exam Attempt Not Found`);
        }
      }
      throw new InternalServerErrorException(
        `Database operation failed ${error}`,
      );
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.examAttempt.delete({ where: { id } });
  }

  async findById(id: string): Promise<ExamAttempt | null> {
    const exam = await this.prisma.examAttempt.findUnique({ where: { id } });
    return exam ? this.mapper.toDomain(exam) : null;
  }
}
