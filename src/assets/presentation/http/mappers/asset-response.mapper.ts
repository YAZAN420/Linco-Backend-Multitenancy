import { Injectable } from '@nestjs/common';
import { AssetResponseDto } from '../dto/asset-response.dto';
import { Asset as DomainAsset } from 'src/assets/domain/asset';
import { CourseResponseMapper } from 'src/courses/presentation/http/mappers/course-response.mapper';
import { AssetWithCourse } from 'src/core/database/prisma/types';

@Injectable()
export class AssetResponseMapper {
  constructor(private readonly courseResponseMapper: CourseResponseMapper) {}
  toResponseFromPrisma(asset: AssetWithCourse): AssetResponseDto {
    return new AssetResponseDto(
      asset.id,
      asset.demoId,
      asset.accessMethod,
      asset.acquiredAt,
      asset.updatedAt,
      asset.course
        ? this.courseResponseMapper.toResponseFromPrisma(asset.course)
        : undefined,
    );
  }

  toResponseFromDomain(asset: DomainAsset): AssetResponseDto {
    return new AssetResponseDto(
      asset.id,
      asset.demoId,
      asset.accessMethod,
      asset.acquiredAt,
      asset.updatedAt,
    );
  }

  toResponseManyFromPrisma(assets: AssetWithCourse[]): AssetResponseDto[] {
    return assets.map((asset) => this.toResponseFromPrisma(asset));
  }
}
