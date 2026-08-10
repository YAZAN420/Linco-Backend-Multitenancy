import { Injectable } from '@nestjs/common';
import { CertificationWithDetails } from 'src/core/database/prisma/types';
import { CertificationResponseDto } from '../dto/certification-response.dto';

@Injectable()
export class CertificationResponseMapper {
  toResponseFromPrisma(
    item: CertificationWithDetails,
  ): CertificationResponseDto {
    return new CertificationResponseDto(
      item.id,
      item.courseId,
      item.demoMemberId,
      item.score,
      `${item.demoMember.user.firstName} ${item.demoMember.user.lastName}`.trim(),
      item.course.title,
      item.course.signatureImagePath,
      item.issuedAt,
      item.createdAt,
      item.updatedAt,
    );
  }

  toResponseManyFromPrisma(
    items: CertificationWithDetails[],
  ): CertificationResponseDto[] {
    return items.map((item) => this.toResponseFromPrisma(item));
  }
}
