import { Injectable } from '@nestjs/common';
import type { Certification as PrismaCertification } from 'src/generated/prisma/client';
import { Certification } from 'src/certifications/domain/certification';

@Injectable()
export class PrismaCertificationMapper {
  toDomain(raw: PrismaCertification): Certification {
    return new Certification(raw.id, {
      courseId: raw.courseId,
      demoMemberId: raw.demoMemberId,
      score: raw.score,
      issuedAt: raw.issuedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(certification: Certification): PrismaCertification {
    return {
      id: certification.id,
      courseId: certification.courseId,
      demoMemberId: certification.demoMemberId,
      score: certification.score,
      issuedAt: certification.issuedAt,
      createdAt: certification.createdAt,
      updatedAt: certification.updatedAt,
    };
  }
}
