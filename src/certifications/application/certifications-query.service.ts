import { Injectable, NotFoundException } from '@nestjs/common';
import { CursorPageDto } from 'src/common/dtos/pagination';
import { Certification } from 'src/generated/prisma/client';
import { FindCertificationsCursorQuery } from './interfaces/find-certifications.query';
import { CertificationQueryRepository } from './ports/certification-query.repository';

@Injectable()
export class CertificationsQueryService {
  constructor(private readonly repository: CertificationQueryRepository) {}

  findAllCursor(
    options: FindCertificationsCursorQuery,
  ): Promise<CursorPageDto<Certification>> {
    return this.repository.findAllCursor(options);
  }

  async findById(id: string): Promise<Certification> {
    const certification = await this.repository.findById(id);
    if (!certification)
      throw new NotFoundException('errors.CERTIFICATION_NOT_FOUND');
    return certification;
  }
}
