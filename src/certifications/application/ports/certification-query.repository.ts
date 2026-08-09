import { CursorPageDto } from 'src/common/dtos/pagination';
import { Certification } from 'src/generated/prisma/client';
import { FindCertificationsCursorQuery } from '../interfaces/find-certifications.query';

export abstract class CertificationQueryRepository {
  abstract findAllCursor(
    options: FindCertificationsCursorQuery,
  ): Promise<CursorPageDto<Certification>>;
  abstract findById(id: string): Promise<Certification | null>;
}
