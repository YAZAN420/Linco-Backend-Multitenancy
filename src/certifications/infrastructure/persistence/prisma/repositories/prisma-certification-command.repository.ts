import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CertificationCommandRepository,
  CourseCompletionSnapshot,
} from 'src/certifications/application/ports/certification-command.repository';
import { Certification } from 'src/certifications/domain/certification';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaCertificationMapper } from '../mappers/prisma-certification.mapper';

@Injectable()
export class PrismaCertificationCommandRepository implements CertificationCommandRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: PrismaCertificationMapper,
  ) {}

  async save(certification: Certification): Promise<void> {
    const data = this.mapper.toPersistence(certification);
    try {
      await this.prisma.certification.upsert({
        where: { id: certification.id },
        update: data,
        create: data,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ConflictException('errors.CERTIFICATION_ALREADY_EXISTS');
        if (error.code === 'P2003')
          throw new NotFoundException(
            'errors.CERTIFICATION_RELATION_NOT_FOUND',
          );
      }
      throw new InternalServerErrorException({
        message: 'errors.DATABASE_OPERATION_FAILED_ERROR',
        args: { error: String(error) },
      });
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.certification.delete({ where: { id } });
  }

  async findById(id: string): Promise<Certification | null> {
    const item = await this.prisma.certification.findUnique({ where: { id } });
    return item ? this.mapper.toDomain(item) : null;
  }

  async existsForCourseAndMember(
    courseId: string,
    demoMemberId: string,
  ): Promise<boolean> {
    return (
      (await this.prisma.certification.count({
        where: { courseId, demoMemberId },
      })) > 0
    );
  }

  async courseExists(courseId: string): Promise<boolean> {
    return (await this.prisma.course.count({ where: { id: courseId } })) > 0;
  }

  async demoMemberExists(demoMemberId: string): Promise<boolean> {
    return (
      (await this.prisma.demoMember.count({ where: { id: demoMemberId } })) > 0
    );
  }

  async courseBelongsToMemberDemo(
    courseId: string,
    demoMemberId: string,
  ): Promise<boolean> {
    return (
      (await this.prisma.course.count({
        where: {
          id: courseId,
          demo: { members: { some: { id: demoMemberId } } },
        },
      })) > 0
    );
  }

  async getCourseCompletionSnapshot(
    examId: string,
    demoMemberId: string,
  ): Promise<CourseCompletionSnapshot | null> {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      select: {
        section: {
          select: { courseId: true, course: { select: { demoId: true } } },
        },
      },
    });
    if (!exam) return null;
    const memberInCourseDemo = await this.prisma.demoMember.count({
      where: { id: demoMemberId, demoId: exam.section.course.demoId },
    });
    if (!memberInCourseDemo) return null;

    const exams = await this.prisma.exam.findMany({
      where: { section: { courseId: exam.section.courseId } },
      select: {
        passingScore: true,
        attempts: {
          where: { demoMemberId },
          select: { score: true },
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        },
      },
    });
    return {
      courseId: exam.section.courseId,
      exams: exams.map((item) => {
        const passedAttempt = item.attempts.find(
          (attempt) => attempt.score >= item.passingScore,
        );
        return { passedAttemptScore: passedAttempt?.score ?? null };
      }),
    };
  }
}
