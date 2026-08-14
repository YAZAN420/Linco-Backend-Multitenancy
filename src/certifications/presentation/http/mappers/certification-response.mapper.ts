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
      item.demoMember.demo.name,
      item.score,
      `${item.demoMember.user.firstName} ${item.demoMember.user.lastName}`.trim(),
      item.demoMember.demo.imagePath,
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
