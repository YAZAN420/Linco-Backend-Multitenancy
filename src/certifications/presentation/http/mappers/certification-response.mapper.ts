import { Injectable } from '@nestjs/common';
import { Certification } from 'src/generated/prisma/client';
import { CertificationResponseDto } from '../dto/certification-response.dto';

@Injectable()
export class CertificationResponseMapper {
  toResponseFromPrisma(item: Certification): CertificationResponseDto {
    return new CertificationResponseDto(
      item.id,
      item.courseId,
      item.demoMemberId,
      item.score,
      item.createdAt,
      item.updatedAt,
    );
  }

  toResponseManyFromPrisma(items: Certification[]): CertificationResponseDto[] {
    return items.map((item) => this.toResponseFromPrisma(item));
  }
}
