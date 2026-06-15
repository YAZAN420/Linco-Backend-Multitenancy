import { Injectable } from '@nestjs/common';
import { AssetResponseDto } from '../dto/asset-response.dto';
import { Asset as PrismaAsset } from 'src/generated/prisma/client';
import { Asset as DomainAsset } from 'src/assets/domain/asset';

@Injectable()
export class AssetResponseMapper {
  toResponseFromPrisma(asset: PrismaAsset): AssetResponseDto {
    return new AssetResponseDto(
      asset.id,
      asset.demoId,
      asset.courseId,
      asset.accessMethod,
      asset.acquiredAt,
      asset.updatedAt,
    );
  }

  toResponseFromDomain(asset: DomainAsset): AssetResponseDto {
    return new AssetResponseDto(
      asset.id,
      asset.demoId,
      asset.courseId,
      asset.accessMethod,
      asset.acquiredAt,
      asset.updatedAt,
    );
  }

  toResponseManyFromPrisma(assets: PrismaAsset[]): AssetResponseDto[] {
    return assets.map((asset) => this.toResponseFromPrisma(asset));
  }
}
