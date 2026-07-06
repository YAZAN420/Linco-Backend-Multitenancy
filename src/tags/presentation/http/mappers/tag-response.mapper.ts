import { Injectable } from '@nestjs/common';
import { Tag as DomainTag } from 'src/tags/domain/tag';
import { TagResponseDto } from '../dtos/tag-response.dto';
import { Tag } from 'src/generated/prisma/browser';

@Injectable()
export class TagResponseMapper {
  constructor() {}
  toResponseFromPrisma(tag: Tag): TagResponseDto {
    return new TagResponseDto(tag.id, tag.name);
  }

  toResponseFromDomain(tag: DomainTag): TagResponseDto {
    return new TagResponseDto(tag.id, tag.name);
  }

  toResponseManyFromPrisma(tags: Tag[]): TagResponseDto[] {
    return tags.map((tag) => this.toResponseFromPrisma(tag));
  }
}
