import { Injectable } from '@nestjs/common';
import { Section as PrismaSection } from 'src/generated/prisma/browser';
import { Section as DomainSection } from 'src/courses/domain/section';
import { SectionResponseDto } from '../dto/section-response.dto';

@Injectable()
export class SectionResponseMapper {
  toResponseFromPrisma(section: PrismaSection): SectionResponseDto {
    return new SectionResponseDto(
      section.id,
      section.title,
      section.order,
      section.createdAt,
      section.updatedAt,
    );
  }

  toResponseFromDomain(section: DomainSection): SectionResponseDto {
    return new SectionResponseDto(
      section.id,
      section.title,
      section.order,
      section.createdAt,
      section.updatedAt,
    );
  }

  toResponseManyFromPrisma(sections: PrismaSection[]): SectionResponseDto[] {
    return sections.map((section) => this.toResponseFromPrisma(section));
  }
}
