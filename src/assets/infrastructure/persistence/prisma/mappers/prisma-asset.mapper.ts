import { Injectable } from '@nestjs/common';
import type { Asset as PrismaAsset } from 'src/generated/prisma/client';
import { Asset } from 'src/assets/domain/asset';
import { AccessMethod } from 'src/assets/domain/enums/access-method.enum';

@Injectable()
export class PrismaAssetMapper {
  toDomain(raw: PrismaAsset): Asset {
    return new Asset(raw.id, {
      demoId: raw.demoId,
      courseId: raw.courseId,
      accessMethod: raw.accessMethod as AccessMethod,
      acquiredAt: raw.acquiredAt,
      updatedAt: raw.updatedAt,
    });
  }

  toPersistence(asset: Asset): PrismaAsset {
    return {
      id: asset.id,
      demoId: asset.demoId,
      courseId: asset.courseId,
      accessMethod: asset.accessMethod,
      acquiredAt: asset.acquiredAt,
      updatedAt: asset.updatedAt,
    };
  }
}
