import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CursorPageDto,
  CursorPageOptionsDto,
} from 'src/common/dtos/pagination';
import { CertificationWithDetails } from 'src/core/database/prisma/types';
import { FindCertificationsCursorQuery } from './interfaces/find-certifications.query';
import { CertificationQueryRepository } from './ports/certification-query.repository';

@Injectable()
export class CertificationsQueryService {
  constructor(private readonly repository: CertificationQueryRepository) {}

  findAllCursor(
    options: FindCertificationsCursorQuery,
  ): Promise<CursorPageDto<CertificationWithDetails>> {
    return this.repository.findAllCursor(options);
  }

  findMineCursor(
    demoMemberId: string,
    options: CursorPageOptionsDto,
  ): Promise<CursorPageDto<CertificationWithDetails>> {
    return this.repository.findAllCursor({ ...options, demoMemberId });
  }

  async findMineByCourse(
    demoMemberId: string,
    courseId: string,
  ): Promise<CertificationWithDetails> {
    const certification = await this.repository.findByCourseAndMember(
      courseId,
      demoMemberId,
    );
    if (!certification)
      throw new NotFoundException('errors.CERTIFICATION_NOT_FOUND');
    return certification;
  }

  async findById(id: string): Promise<CertificationWithDetails> {
    const certification = await this.repository.findById(id);
    if (!certification)
      throw new NotFoundException('errors.CERTIFICATION_NOT_FOUND');
    return certification;
  }
}
