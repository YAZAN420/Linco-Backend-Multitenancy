import { Injectable } from '@nestjs/common';
import { CertificationQueryRepository } from 'src/certifications/application/ports/certification-query.repository';
import { FindCertificationsCursorQuery } from 'src/certifications/application/interfaces/find-certifications.query';
import { CursorPageDto } from 'src/common/dtos/pagination';
import { CursorPageMetaDto } from 'src/common/dtos/pagination/cursor/cursor-page-meta.dto';
import { PrismaService } from 'src/core/database/prisma/prisma.service';
import { CertificationWithDetails } from 'src/core/database/prisma/types';

const certificationDetailsSelect = {
  id: true,
  courseId: true,
  demoMemberId: true,
  score: true,
  issuedAt: true,
  createdAt: true,
  updatedAt: true,
  course: {
    select: {
      title: true,
      signatureImagePath: true,
    },
  },
  demoMember: {
    select: {
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class PrismaCertificationQueryRepository implements CertificationQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCursor(
    options: FindCertificationsCursorQuery,
  ): Promise<CursorPageDto<CertificationWithDetails>> {
    const { cursor, take, courseId, demoMemberId } = options;
    const items = await this.prisma.certification.findMany({
      where: { courseId, demoMemberId },
      take: take + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: certificationDetailsSelect,
    });
    const hasNextPage = items.length > take;
    if (hasNextPage) items.pop();
    const endCursor = items.length ? items[items.length - 1].id : null;
    return new CursorPageDto(
      items,
      new CursorPageMetaDto(hasNextPage, endCursor),
    );
  }

  findById(id: string): Promise<CertificationWithDetails | null> {
    return this.prisma.certification.findUnique({
      where: { id },
      select: certificationDetailsSelect,
    });
  }

  findByCourseAndMember(
    courseId: string,
    demoMemberId: string,
  ): Promise<CertificationWithDetails | null> {
    return this.prisma.certification.findUnique({
      where: { courseId_demoMemberId: { courseId, demoMemberId } },
      select: certificationDetailsSelect,
    });
  }
}
