import { CursorPageDto } from 'src/common/dtos/pagination';
import { CertificationWithDetails } from 'src/core/database/prisma/types';
import { FindCertificationsCursorQuery } from '../interfaces/find-certifications.query';

export abstract class CertificationQueryRepository {
  abstract findAllCursor(
    options: FindCertificationsCursorQuery,
  ): Promise<CursorPageDto<CertificationWithDetails>>;
  abstract findById(id: string): Promise<CertificationWithDetails | null>;
  abstract findByCourseAndMember(
    courseId: string,
    demoMemberId: string,
  ): Promise<CertificationWithDetails | null>;
}
