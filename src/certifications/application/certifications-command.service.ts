import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Certification } from '../domain/certification';
import { CertificationFactory } from '../domain/factories/certification.factory';
import { CreateCertificationInput } from './interfaces/create-certification-input.interface';
import { CertificationCommandRepository } from './ports/certification-command.repository';

@Injectable()
export class CertificationsCommandService {
  constructor(
    private readonly repository: CertificationCommandRepository,
    private readonly factory: CertificationFactory,
  ) {}

  async create(input: CreateCertificationInput): Promise<Certification> {
    await this.validateRelations(input.courseId, input.demoMemberId);
    if (
      await this.repository.existsForCourseAndMember(
        input.courseId,
        input.demoMemberId,
      )
    ) {
      throw new ConflictException('errors.CERTIFICATION_ALREADY_EXISTS');
    }
    const certification = this.factory.createNew(
      input.courseId,
      input.demoMemberId,
      input.score,
    );
    await this.repository.save(certification);
    return certification;
  }

  async issueIfCourseCompleted(
    examId: string,
    demoMemberId: string,
  ): Promise<Certification | null> {
    const snapshot = await this.repository.getCourseCompletionSnapshot(
      examId,
      demoMemberId,
    );
    if (!snapshot || snapshot.exams.length === 0) return null;
    if (snapshot.exams.some((exam) => exam.passedAttemptScore === null)) {
      return null;
    }
    if (
      await this.repository.existsForCourseAndMember(
        snapshot.courseId,
        demoMemberId,
      )
    )
      return null;

    const score = Math.round(
      snapshot.exams.reduce((sum, exam) => sum + exam.passedAttemptScore!, 0) /
        snapshot.exams.length,
    );
    const certification = this.factory.createNew(
      snapshot.courseId,
      demoMemberId,
      score,
    );
    await this.repository.save(certification);
    return certification;
  }

  async remove(id: string): Promise<void> {
    const certification = await this.repository.findById(id);
    if (!certification)
      throw new NotFoundException('errors.CERTIFICATION_NOT_FOUND');
    await this.repository.delete(id);
  }

  private async validateRelations(
    courseId: string,
    demoMemberId: string,
  ): Promise<void> {
    if (!(await this.repository.courseExists(courseId)))
      throw new NotFoundException('errors.COURSE_NOT_FOUND');
    if (!(await this.repository.demoMemberExists(demoMemberId)))
      throw new NotFoundException('errors.DEMO_MEMBER_NOT_FOUND');
    if (
      !(await this.repository.courseBelongsToMemberDemo(courseId, demoMemberId))
    ) {
      throw new BadRequestException(
        'errors.CERTIFICATION_COURSE_AND_MEMBER_MUST_BELONG_TO_THE_SAME_WORKSPACE',
      );
    }
  }
}
