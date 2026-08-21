import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { ExamAttempt } from 'src/exams/domain/exam-attempt';
import { ExamAttemptCommandRepository } from 'src/exams/application/ports/exam-attempt-command.repository';
import { PrismaExamAttemptMapper } from '../mappers/prisma-exam-attempt.mapper';

@Injectable()
export class PrismaExamAttemptCommandRepository implements ExamAttemptCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaExamAttemptMapper,
  ) {}

  async save(examAttempt: ExamAttempt): Promise<void> {
    const data = this.mapper.toPersistence(examAttempt);
    try {
      await this.prisma.examAttempt.upsert({
        where: { id: examAttempt.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('errors.EXAM_ATTEMPT_ALREADY_EXISTS');
      }
      throw new InternalServerErrorException({
        message: 'errors.DATABASE_OPERATION_FAILED_ERROR',
        args: { error: String(error) },
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.examAttempt.delete({ where: { id } });
  }

  async findById(id: string): Promise<ExamAttempt | null> {
    const exam = await this.prisma.examAttempt.findUnique({ where: { id } });
    return exam ? this.mapper.toDomain(exam) : null;
  }

  async hasPassedAttempt(
    demoMemberId: string,
    examId: string,
    passingScore: number,
  ): Promise<boolean> {
    return (
      (await this.prisma.examAttempt.count({
        where: {
          demoMemberId,
          examId,
          score: { gte: passingScore },
        },
      })) > 0
    );
  }

  async hasPassedAllPreviousExams(
    demoMemberId: string,
    examId: string,
  ): Promise<boolean> {
    const targetExam = await this.prisma.exam.findUnique({
      where: { id: examId },
      select: { section: { select: { courseId: true, order: true } } },
    });
    if (!targetExam) return false;

    const previousSections = await this.prisma.section.findMany({
      where: {
        courseId: targetExam.section.courseId,
        order: { lt: targetExam.section.order },
      },
      select: {
        exam: {
          select: {
            passingScore: true,
            attempts: {
              where: { demoMemberId },
              select: { score: true },
            },
          },
        },
      },
    });

    return previousSections.every(
      ({ exam }) =>
        exam === null ||
        exam.attempts.some((attempt) => attempt.score >= exam.passingScore),
    );
  }
}
